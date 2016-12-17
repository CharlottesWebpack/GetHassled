const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const mongoose = require('mongoose');

// load user model
var User = require('./userModel.js');

// load API keys
var Keys = require('./keys.js');

module.exports = function(passport) {

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findOne({
      'id': id
    }, function(err, user) {
      done(err, user);
    });
  });

  // pull in our info from keys.js
  passport.use(new FacebookStrategy({
    clientID: process.env.CLIENT_ID || Keys.facebook.clientID,
    clientSecret: process.env.CLIENT_SECRET || Keys.facebook.clientSecret,
    callbackURL: process.env.CALLBACK_URL || Keys.facebook.callbackURL,
    // profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
  },
  // facebook will send back the token and profile info
  function(token, refreshToken, profile, done) {
    process.nextTick(function() {
      // use facebook info to find matching user in our database
      User.findOne({ id: profile.id }, function(err, user) {
        if (err) {
          return done(err);
        } else if (user) {
          // pass user back to passport if found
          return done(null, user);
        } else {
          console.log('this is the profile', profile)
          // create new user if none is found
          var newUser = new User();
          newUser.token = token;
          newUser.id = profile.id;
          newUser.name = profile.displayName;
          if(profile.emails) {
            newUser.email = profile.emails[0].value;
          } else {
            newUser.email = null;
          }
          // pass new user back to passport after saving to database
          newUser.save((err) => err ? done(err) : done(null, newUser));
        }
      })
    });
  }));

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || Keys.google.client_id,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || Keys.google.client_secret,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || Keys.google.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      User.findOne({ id: profile.id }, function (err, user) {
        if (err) return done(err);
        else if (user) {
          return done(null, user); // pass user back to passport if found
        } else { //create new user if now found
          var newUser = new User();
          newUser.id = profile.id;
          newUser.name = profile.displayName;
          newUser.save((err) => err ? done(err) : done(null, newUser));
        }
      });
    });
  }));
};
