// jshint esversion: 6

// configure server
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var port = process.env.PORT || 8000;
var app = express();
var nodemailer = require('nodemailer');
var fs = require('fs');
// configure database
var morgan = require('morgan');
var mongoose = require('mongoose');
const DB = require('./dbConfig.js');
mongoose.connect( process.env.DB_PATH || DB.path);
var db = mongoose.connection;
var User = require('./userModel.js');
var Challenge = require('./challengeModel.js');
mongoose.Promise = global.Promise; // use native JS promises
var smtpTransport = require("nodemailer-smtp-transport");
var smtpTransport = nodemailer.createTransport(smtpTransport({
    host : "smtp.gmail.com",
    secureConnection : true,
    port: 465,
    auth : {
        user : "gethasstled.org",
        pass : "abeeabee"
    }
}));

// log every request to the console
app.use(morgan('dev'));

// configure authentication
var session = require('express-session');
var passport = require('passport');
require('./auth.js')(passport);
app.use(session({
  secret: 'squirrel',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// configure twilio
var twilioService = require('./sms/sms.js');

// configure harassment logic
var harassmentEngine = require('./sms/harassmentEngine.js');

// serve static files
app.use('/', express.static(path.join(__dirname, '../client/login')));
app.use('/app', express.static(path.join(__dirname, '../client')));
app.use('/modules', express.static(path.join(__dirname, '../node_modules')));

// parse requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// authentication routes
app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email' ] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  failureRedirect: "/"
}), (req, res) => {
    // passport attaches user information to all incoming requests
    if (!req.user.goal) {
      // if user has no goal, allow them to create one
      res.redirect('/app/#/create');
    } else {
      // else log user in and redirect to goal status page
      res.redirect('/app/#/status');
    }
});

app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: "/"
}), (req, res) => {
    console.log("request google callback", req.user);
    // passport attaches user information to all incoming requests
    if (!req.user.goal) {
      // if user has no goal, allow them to create one
      res.redirect('/app/#/create');
    } else {
      // else log user in and redirect to goal status page
      res.redirect('/app/#/status');
    }
});


app.get('/logout', (req, res) => {
  // passport attaches logout method to all requests
  req.logout();
  res.redirect('/');
});

// user info route
app.get('/user', function(req, res) {
  res.send(req.user);
});

// new user route
app.post('/create', function(req, res) {
  User.findById(req.body._id, function(err, user) { //find the user and create or update his goal and other info
    user.goal = req.body.goal;
    user.phoneNumber = req.body.phoneNumber;
    user.buddyName = req.body.buddyName;
    user.buddyPhone = req.body.buddyPhone;
    user.responses = [];
    user.grade = 100;
    user.harassUser = false;
    user.harassBuddy = false;
    user.goalLength = req.body.goalLength.value;
    user.mode = req.body.mode;
    user.dateGoalCreated = req.body.dateGoalCreated;

    user.save()
    .then((updatedUser) => {
      res.send(updatedUser);
      console.log(updatedUser);
      return updatedUser;
    })
    .then((updatedUser) => {
      User.findOne({phoneNumber: user.buddyPhone}, function (err, buddy) { //find the buddy in db, add the user to buddy's friends array
        if (err) {console.error(err);}
        else {
          if (buddy.friends) {
            buddy.friends.push(updatedUser);
          } else {
            buddy.friends = [updatedUser];
          }
          buddy.save();
        }
      });
    })
    .catch((err) => {
      res.send(err);
    });

    twilioService.sendWelcome(user.phoneNumber, user.mode);
    twilioService.notifyBuddy(user.buddyPhone, user.name, user.goal);
  });

});

app.get('/challenge', function(req, res) {
  var userNumber = req.user.phoneNumber;
  Challenge.find().populate('challenger1 challenger2', 'name phoneNumber -_id')
  .then(function(challenges) {
    console.log(challenges);
    res.status(200).json(challenges);
  }).catch(function(err) {
    console.log('this is an err: ', err);
    res.status(400).json(err);
  });
});

app.post('/challenge', function(req, res) {
  console.log('this is the request body: ', req.body);
  var challenger1Num = req.body.challenger1PhoneNumber;
  var challenger2Num = req.body.challenger2PhoneNumber;
  var challenger1Name = req.body.challenger1Name;
  var challenger2Name = req.body.challenger2Name;
  var challengeGoal = req.body.challengeGoal;

  var challenger1 = User.findOne({
    phoneNumber: challenger1Num
  });

  var challenger2 = User.findOne({
    phoneNumber: challenger2Num
  });

  Promise.all([challenger1, challenger2])
  .then(function(challengers) {
    console.log('these r the challengers:', challengers);
    Challenge.create({
      challengeGoal: challengeGoal,
      challenger1: challengers[0],
      challenger2: challengers[1]
    }).then(function(challenge) {
      res.status(200).json(challenge);
    }).catch(function(err) {
      res.status(400).json(err);
    });
  }).catch(function(err) {
    res.status(400).json(err);
  });
  twilioService.challengeNotification(challenger1Num, challenger2Num, challenger1Name, challenger2Name, challengeGoal);
});

app.post('/deleteChallenge', function(req, res) {
  // console.log(req.body);
  var winnerPhoneNumber = req.body.winner;
  var loserPhoneNumer;
  Challenge.findById(req.body._id)
  .populate('challenger1 challenger2')
  .then(function(challenge) {
    if(challenge.challenger1.phoneNumber === winnerPhoneNumber) {
      loserPhoneNumer = challenge.challenger2.phoneNumber;
    }else {
      loserPhoneNumer = challenge.challenger1.phoneNumber;
    }
    twilioService.endChallengeNotification(winnerPhoneNumber, loserPhoneNumer, challenge.challengeGoal);
    challenge.remove().then(function(removedChallenge) {
      res.status(200).send('you\'re awesome');
    });
  });
});

// goal completion routes
app.post('/finish', function(req, res) {
  User.findById(req.user._id, function(err, user) {

    twilioService.userGoalComplete(user.phoneNumber); // text user goal is complete
    twilioService.buddyGoalComplete(user.buddyPhone); // text buddy goal is complete

    user.goal = null;
    user.save()
    .then((updatedUser) => {
      res.send(updatedUser);
      return updatedUser;
    })
    .then((updatedUser) => {
      User.findOne({phoneNumber: user.buddyPhone}, function (err, buddy) { //find the buddy in db, remove the user from buddy's friends array
        if (err) {console.error(err);}
        else {
          buddy.friends.id(updatedUser._id).remove();
          buddy.save();
        }
      });
    })
    .catch((err) => {
      res.send(err);
    });
  });
});

// twilio routes
app.get('/messageToConsole', function(req, res) {
  var from = req.query.From.substring(2);

  //figure out phone number of request
  User.findOne({
    phoneNumber: from // finds the user in the db
  }, function(err, user) {
    if (err) {
      console.log(err);
    } else if (user) { // if user exists in db
      // update the grade
      if(user.responses && user.responses.length) {

        // ensure that at least spam message has been sent, populated by an fail to be replaced

        // overwrite response at last entry in response array
        user.responses[user.responses.length - 1] = [Date.now(), req.query.Body];

        // update user in database and invoke grading function on user
        User.update({_id: user._id}, {responses: user.responses}, function() {
          exports.gradeUsers();
        });

      }
      // send text message response
      twilioService.responseMaker(req, res, user.mode);
    }
  });

});

app.post('/callUser', function(req, res) {
  fs.readFile(__dirname + '/sms/callUser.xml', (err, data) => {
    if (err) console.error(err);
    res.set('Content-Type', 'text/xml');
    res.send(data);
  });
});

app.post('/callBuddy', function(req, res) {
  fs.readFile(__dirname + '/sms/callBuddy.xml', (err, data) => {
    if (err) console.error(err);
    res.set('Content-Type', 'text/xml');
    res.send(data);
  });
});

// dev testing route for manually invoking spam functions
app.post('/test', function(req, res) {
  exports.spam();
  exports.gradeUsers();
  res.send();
});

// API route for possible future development
app.post('/externaHarassmentAPI', function(req, res) {
  // console.log("received this data from harassment API", req);
  // console.log("body data", req.body);

  res.send("Piss off your friends!");
});

exports.challengeReminder = function() {
  Challenge.find().then(function(challenges) {
    Challenge.populate(challenges, 'challenger1 challenger2')
    .then(function(challenges) {
      console.log(challenges);
      challenges.forEach(function(challenge) {
        twilioService.challengeUpdateReminder([challenge.challenger1.phoneNumber, challenge.challenger2.phoneNumber], challenge.challengeGoal);
      });
    });
  });
};

// spam routine
exports.spam = function() {
  User.find((err, users) => {
    users.forEach(user => {
      if(user.goal) {
      // send harassment messages
        var harassmentState = harassmentEngine.harassmentChecker(user);
        user.harassUser = harassmentState.harassUser;
        user.harassBuddy = harassmentState.harassBuddy;


          // send out goal survey if user has a goal
          twilioService.periodicGoalPoll(user.phoneNumber, user.goal);

          user.responses.push([Date.now(), 'new fail.']); // made changes to response array


        User.findOne({
          phoneNumber: user.phoneNumber
        }, function(err, updateUser) {
          updateUser.responses = user.responses;
          updateUser.save();
        });
      }
    });
  });

  exports.gradeUsers();
};

// invokes grade function for all users
exports.gradeUsers = function() {
  // query database for all users
  User.find((err, users) => {
    users.forEach(grade);
  });
};

// grades users based on their response history
function grade(user) {
  if(user.responses && user.responses.length) {

    // calculate percentage of positive ('1') responses
    var progress = user.responses.reduce((acc, tuple) => tuple ? (tuple[1] === '1' ? ++acc : acc) : null, 0);
    user.grade = Math.round(progress / user.responses.length * 100);

    if (user.grade < 40) {
      var mailOptions = {
        from : "gethasstled.org@gmail.com",
        to : user.email,
        subject : "Get it together",
        text : "You're not making progress on your goal. Get it together and start working harder."
      };
      console.log(mailOptions);
      smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
          console.log(error);
        } else{
          console.log("Message sent");
        }
      });
    }

    // update database entry
    User.update({_id: user._id}, {grade: user.grade}, err => err ? console.error(err) : null);
  }
}


app.post('/users/delete', function(req, res){
    var userId = req.user._id;
    User.remove({"_id": userId}, function(err, data){
      if(err){
        res.send(404);
      }else {
        res.send("deleted");
      }
    });
});

// start server
db.once('open', function (){
  console.log('mongo connection established');
  app.listen(port);
  console.log('Listening on port ' + port + '...');
});
