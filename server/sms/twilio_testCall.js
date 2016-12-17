var Keys = require('../keys');
var SMSResponses = require('./responses');
var SensitiveSMSResponses = require('./sensitiveResponses');
var TWILIO_NUMBER = process.env.TWILIO_NUMBER || Keys.twilio.TWILIO_NUMBER;
var TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || Keys.twilio.TWILIO_ACCOUNT_SID;
var TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || Keys.twilio.TWILIO_AUTH_TOKEN;
var twilio = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

twilio.makeCall({
    from: '+12168209563',
    to: '+17602755151',
    url: "https://get-hassled.herokuapp.com/makeCalls",
  }, function (err, responseData) {
    console.log(responseData);
  });