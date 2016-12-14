
//Paste your Twilio and Facebook keys here//
module.exports = {
  'facebook': {
     'clientID': '1738452879814619',
     'clientSecret': 'b61fff0666bd590494259b403c39184b',
     //'callbackURL': 'https://peaceful-caverns-27176.herokuapp.com/auth/facebook/callback'
     'callbackURL': 'http://localhost:8000/auth/facebook/callback'
   },

  'twilio': {
    'TWILIO_ACCOUNT_SID': 'ACb3a1fa64cf2cf3f28263f26b97615ea0',
    'TWILIO_AUTH_TOKEN': '9601b77311da0c5f918a3a2bf56aa0a2',
    'TWILIO_NUMBER': '+12168209563'
  }
};
