// jshint esversion: 6
var Keys = require('../keys');
var SMSResponses = require('./responses');
var SensitiveSMSResponses = require('./sensitiveResponses');
var TWILIO_NUMBER = process.env.TWILIO_NUMBER || Keys.twilio.TWILIO_NUMBER;
var TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || Keys.twilio.TWILIO_ACCOUNT_SID;
var TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || Keys.twilio.TWILIO_AUTH_TOKEN;
var twilio = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

//===========send welcome message ====================//

exports.sendWelcome = function(userPhoneNumber, mode) {
  var welcome = mode === 'sensitive' ?
    `Welcome to Hassled. You'll get a daily text from hassle to check in on your progress. Stay on track! ` :
    `Welcome to Hassled, loser. You'll get a daily text from hassle to check in on your progress. Stay on track... or you'll regret it. `
  twilio.sendMessage({
    to: `+1${userPhoneNumber}`, // Any number Twilio can deliver to
    from: TWILIO_NUMBER, // A number you bought from Twilio and can use for outbound communication
    body:  welcome// body of the SMS message

  }, function(err, responseData) { //this function is executed when a response is received from Twilio
    if (!err) { // "err" is an error received during the request, if any
      console.log(responseData.body); // outputs "word to your mother."
    }
  });
};

exports.challengeNotification = function(userPhoneNumber1, userPhoneNumber2, challenger1Name, challenger2Name, challengeGoal) {
  twilio.sendMessage({
    to: `+1${userPhoneNumber1}`, // Any number Twilio can deliver to
    from: TWILIO_NUMBER, // A number you bought from Twilio and can use for outbound communication
    body: `You challenged your friend ${challenger2Name} to ${challengeGoal} You'll get a daily text from hassle to check in on your progress. If you loose we'll spam you for five days ` // body of the SMS message

  }, function(err, responseData) { //this function is executed when a response is received from Twilio
    if (!err) { // "err" is an error received during the request, if any
      console.log(responseData.body); // outputs "word to your mother."
    }
  });
  twilio.sendMessage({
    to: `+1${userPhoneNumber2}`, // Any number Twilio can deliver to
    from: TWILIO_NUMBER, // A number you bought from Twilio and can use for outbound communication
    body: `Your friend ${challenger1Name} challenged you to ${challengeGoal}. You'll get a daily text from hassle to check in on your progress. If you loose we'll spam you for five days. ` // body of the SMS message

  }, function(err, responseData) { //this function is executed when a response is received from Twilio
    if (!err) { // "err" is an error received during the request, if any
      console.log(responseData.body); // outputs "word to your mother."
    }
  });
};

exports.challengeUpdateReminder = function(challengerPhoneNumbers, challengeGoal) {
  challengerPhoneNumbers.forEach(function(challengerPhoneNumber) {
    twilio.sendMessage({
      to: `+1${challengerPhoneNumber}`, // Any number Twilio can deliver to
      from: TWILIO_NUMBER, // A number you bought from Twilio and can use for outbound communication
      body: `You must complete your ${challengeGoal} challenge to avoid more excessive spamming such as this... ` // body of the SMS message

    }, function(err, responseData) { //this function is executed when a response is received from Twilio
      if (!err) { // "err" is an error received during the request, if any
        console.log(responseData.body); // outputs "word to your mother."
      }
    });
  });
};

exports.endChallengeNotification = function(challengeWinnerPhoneNumber, challengeLoserPhoneNumber, challengeGoal) {
  twilio.sendMessage({
    to: `+1${challengeWinnerPhoneNumber}`, // Any number Twilio can deliver to
    from: TWILIO_NUMBER, // A number you bought from Twilio and can use for outbound communication
    body: `You won your ${challengeGoal} challenge!!! Congats!! ` // body of the SMS message

  }, function(err, responseData) { //this function is executed when a response is received from Twilio
    if (!err) { // "err" is an error received during the request, if any
      console.log(responseData.body); // outputs "word to your mother."
    }
  });
  twilio.sendMessage({
    to: `+1${challengeLoserPhoneNumber}`, // Any number Twilio can deliver to
    from: TWILIO_NUMBER, // A number you bought from Twilio and can use for outbound communication
    body: `You lost your ${challengeGoal} challenge :( ... You'll now get spamed for five days :(( ` // body of the SMS message

  }, function(err, responseData) { //this function is executed when a response is received from Twilio
    if (!err) { // "err" is an error received during the request, if any
      console.log(responseData.body); // outputs "word to your mother."
    }
  });
};

//==========notify the buddy about their friend setting a goal===========//
exports.notifyBuddy = function(buddyPhoneNumber, userName, userGoal) {
  twilio.sendMessage({
    to: `+1${buddyPhoneNumber}`,
    from: TWILIO_NUMBER,
    body: `${userName} claims to know you and just threw you under the bus by signing up to Get Hassled about: ${userGoal}. Watch out because when they fail, we'll start hassling you.`
  }, function(err, responseData) {
    if(!err) {
      console.log(responseData.body);
    }
  });
};

//=========== outbound period question service ====================//

exports.periodicGoalPoll = function(userPhoneNumber, userGoal) {
  twilio.sendMessage({
    to: `+1${userPhoneNumber}`, // Any number Twilio can deliver to
    from: TWILIO_NUMBER, // A number you bought from Twilio and can use for outbound communication
    body: `Did you make progress towards your goal? ## ${userGoal} ## Respond 1 for 'yes' -or- 2 for 'no'.` //,
      //  mediaUrl: 'https://s-media-cache-ak0.pinimg.com/originals/53/e6/eb/53e6eb8b9396ee2c1cc99b69582a07f3.jpg'
      // body of the SMS message
  }, function(err, responseData) { //this function is executed when a response is received from Twilio

    if (!err) { // "err" is an error received during the request, if any
      console.log(responseData.body); // outputs "word to your mother."

    }
  });
};

//=========== outbound harassment message to USER ====================//

exports.harassUser = function(userPhoneNumber) {
////NEW CODE CALLING USERS
  twilio.makeCall({
    from: TWILIO_NUMBER,
    to: `+1${userPhoneNumber}`,
    url: "https://get-hassled.herokuapp.com/callUser",
  }, function (err, responseData) {
    console.log(responseData);
  });

/////OLD CODE SENDING TEXTS
  // twilio.sendMessage({
  //   to: `+1${userPhoneNumber}`, // Any number Twilio can deliver to
  //   from: TWILIO_NUMBER, // A number you bought from Twilio and can use for outbound communication
  //   body: `You're falling behind on your goal. Get back on track to end these messages.` //,
  //     //  mediaUrl: 'https://s-media-cache-ak0.pinimg.com/originals/53/e6/eb/53e6eb8b9396ee2c1cc99b69582a07f3.jpg'
  //     // body of the SMS message
  // }, function(err, responseData) { //this function is executed when a response is received from Twilio

  //   if (!err) { // "err" is an error received during the request, if any
  //   }
  // });
};


//=========== outbound harassment message to USER ====================//

exports.harassBuddy = function(buddyPhone) {
  ////NEW CODE CALLING USERS
  twilio.makeCall({
    from: TWILIO_NUMBER,
    to: `+1${buddyPhone}`,
    url: "https://get-hassled.herokuapp.com/callBuddy",
  }, function (err, responseData) {
    console.log(responseData);
  });

/////OLD CODE SENDING TEXTS
  // twilio.sendMessage({
  //   to: `+1${buddyPhone}`, // Any number Twilio can deliver to
  //   from: TWILIO_NUMBER, // A number you bought from Twilio and can use for outbound communication
  //   body: `Your buddy is falling behind on their goal. Make them work harder to end these messages` //,
  //     //  mediaUrl: 'https://s-media-cache-ak0.pinimg.com/originals/53/e6/eb/53e6eb8b9396ee2c1cc99b69582a07f3.jpg'
  //     // body of the SMS message
  // }, function(err, responseData) { //this function is executed when a response is received from Twilio

  //   if (!err) { // "err" is an error received during the request, if any
  //   }
  // });
};

//=========== outbound complete message to USER ====================//

exports.userGoalComplete = function(userPhoneNumber) {
  console.log('inside usergoal complete');
  twilio.sendMessage({
    to: `+1${userPhoneNumber}`, // Any number Twilio can deliver to
    from: TWILIO_NUMBER, // A number you bought from Twilio and can use for outbound communication
    body: `Congrats on completing your goal. We're proud.` //,
      //  mediaUrl: 'https://s-media-cache-ak0.pinimg.com/originals/53/e6/eb/53e6eb8b9396ee2c1cc99b69582a07f3.jpg'
      // body of the SMS message
  }, function(err, responseData) { //this function is executed when a response is received from Twilio

    if (!err) { // "err" is an error received during the request, if any
    }
  });
};

//=========== outbound complete message to USER ====================//

exports.buddyGoalComplete = function(buddyPhone) {
    console.log('inside buddy goal complete');
  twilio.sendMessage({
    to: `+1${buddyPhone}`, // Any number Twilio can deliver to
    from: TWILIO_NUMBER, // A number you bought from Twilio and can use for outbound communication
    body: `Your buddy recently completed their goal. If they're lying, are they a friend worth keeping?` //,
      //  mediaUrl: 'https://s-media-cache-ak0.pinimg.com/originals/53/e6/eb/53e6eb8b9396ee2c1cc99b69582a07f3.jpg'
      // body of the SMS message
  }, function(err, responseData) { //this function is executed when a response is received from Twilio

    if (!err) { // "err" is an error received during the request, if any
    }
  });
};



//=========== respond to messages ====================//


exports.responseMaker = function(req, res, mode) {

  var twilio = require('twilio');
  var twiml = new twilio.TwimlResponse();

  var smsResponseBucket = SMSResponses;
  if (mode === 'sensitive') {
    smsResponseBucket = SensitiveSMSResponses;
  }

  var randomPositive= Math.floor(Math.random() * smsResponseBucket.positiveResponses.length);

  var randomNegative= Math.floor(Math.random() * smsResponseBucket.negativeResponses.length);

  if (req.query.Body == 1) {
    twiml.message(smsResponseBucket.positiveResponses[randomPositive]);
  } else if (req.query.Body == 2) {
    twiml.message(smsResponseBucket.negativeResponses[randomNegative]);
    // twiml.mediahttps: //s-media-cache-ak0.pinimg.com/originals/53/e6/eb/53e6eb8b9396ee2c1cc99b69582a07f3.jpg
  } else {
    twiml.message(`It's 1 or 2 for a response...`);
  }
  res.writeHead(200, {
    'Content-Type': 'text/xml'
  });
  res.end(twiml.toString());

};


////////////////////////////////////////////////////////
//////////Disregard the rest (made for testing)//////////////
////////////////////////////////////////////////////////


// //=========== get last inbound response not tied to user ====================//


exports.getLastResponse = function() {

  var lastResponse;

  var promise = new Promise(function(resolve, reject) {

    twilio.messages.list(function(err, data) {
      lastResponse = data.messages[1].body;
      //go to db
      resolve(data); //fance promise
    });
    return promise;
  })
  .then(function(data) {
    if (lastResponse === "1") {
      twilio.sendMessage({
        to: `+1${6468318760}`, // Any number Twilio can deliver to
        from: TWILIO_NUMBER, // A number you bought from Twilio and can use for outbound communication
        body: `you must be very proud of yourself` // body of the SMS message
      }, function(err, responseData) { //this function is executed when a response is received from Twilio
        if (!err) { // "err" is an error received during the request, if any
        }
      });

    }

    if (lastResponse === "2") {
      twilio.sendMessage({
        to: `+1${6468318760}`, // Any number Twilio can deliver to
        from: TWILIO_NUMBER, // A number you bought from Twilio and can use for outbound communication
        body: `wow you suck at this` // body of the SMS message
      }, function(err, responseData) { //this function is executed when a response is received from Twilio
        if (!err) { // "err" is an error received during the request, if any
          console.log(responseData.body); // outputs "word to your mother."
        }
      });
    }
  });

};


//=========== get all message history for testing ====================//
exports.getAllMessages = function() {
  twilio.messages.list(function(err, data) {
    data.messages.forEach(function(message) {
      console.log(message.body);
    });
  });
};



// =========== call users that did not achieve their goal in set time ====================//
////TEST FUNCTION, DOES NOT HAVE A ROUTE ANYMORE
exports.spamCall = function(user){
  twilio.makeCall({
    from: TWILIO_NUMBER,
    to: user.phoneNumber,
    url: "http://demo.twilio.com/docs/voice.xml",
  }, function (err, responseData) {
    console.log(responseData);
  });
};
