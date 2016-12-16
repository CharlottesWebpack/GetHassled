// configure twilio
var twilioService = require('./sms.js');


// parses responses array for the users last three responses. If less than 3 days, replaced with [1, 1, 1] as "positive"
getLastThreeResponses = function(responses){
  var arrayOfResponses = [];
  if (responses.length >2){
    for (var i = responses.length-1; i> responses.length - 4; i--) {
      if (responses[i]) {
        arrayOfResponses.push(responses[i][1]);
      }
    }
  return arrayOfResponses;
  } else{
  return ["1", "1", "1"]; //if there is less than 3 days of data, then keep positive
  }
};

// var responsesArray = [ ["date","1"], ['date', "2"], ['date', "2"]  ];


// generate random time sometime in teh next 24 hrs to send the message
  var timeFromNowToHarass = function(){
     return Math.random()*(10*60*1000);

    // return 30*1000;
  };


exports.harassmentChecker = function(user){


  var lastThreeResponses = getLastThreeResponses(user.responses);

  //initialize states to false
  var harassUser = false;
  var harassBuddy = false;

  // test to see if we should harass user
  if (lastThreeResponses[0] !=="1" && lastThreeResponses[1]!=="1") {
    harassUser = true;
  }

  // test to see if we should harass buddy
  if (lastThreeResponses[0] !=="1" && lastThreeResponses[1]!=="1" && lastThreeResponses[2]!=="1") {
    harassBuddy = true;
  }

  // if harassment flag true
  if (harassUser) {
    // generate random time

    setTimeout( function(){
        twilioService.harassUser(user.phoneNumber);
      }, timeFromNowToHarass());
  }

  if (harassBuddy) {
    twilioService.harassBuddy(user.buddyPhone);
  }

  // return harassment object to be then used by server to update the db for admins fyi.
  return {
          harassUser: harassUser,
          harassBuddy: harassBuddy
        };

};
