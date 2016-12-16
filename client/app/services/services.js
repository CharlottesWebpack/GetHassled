angular.module('app.service', [])

.factory('createFactory',  function($http, $location) {
  var sensitive = {
    modeName: 'sensitive',
    addHeader: "delicate flower",
    addPlaceholder: "Start working on your goals!",
    buddyPlaceholder: "Your supportive friend",
    buddiesHeader: "friends' progress",
    finishedQuestion: "If you lie about it, you'll feel bad about yourself and will never learn to acomplish your goals.",
    finishedAnswer: "I'll make it work.",
    finishedHeader: "Good job! You deserve a treat!",
    setNew: "Set a new goal!",
    unicornMsg: 'This unicorn is here to tell you what a great job you\'re doing!',
    slothMsg: 'Take this sloth\'s vacant stare as an indication that you\'re doing an average job.',
    rainbowMsg: 'Rainbow dash is incredibly dissappointed in your performance. Get it together.',
    progress1: 'you did great',
    progress2: 'not your best day'
  };
  var regular = {
    modeName: 'regular',
    addHeader: "you worthless piece of shit",
    addPlaceholder: "Get off your ass!",
    buddyPlaceholder: "Don't make us call your mother...",
    buddiesHeader: "piece of shit friends",
    finishedQuestion: "If you lie to us we will find out and come to your house and take a dump on the porch...",
    finishedAnswer: "Please don't do that...",
    finishedHeader: "What do you want, a fucking cookie?",
    setNew: "Set a new goal already...",
    unicornMsg: 'This unicorn stripper is here to tell you what a great job you\'re doing!',
    slothMsg: 'Take this sloth\'s vacant stare as an indication of how perfectly average we find you.',
    rainbowMsg: 'Rainbow dash is incredibly dissappointed in your performance. Get your shit together...',
    progress1: 'you didn\'t suck',
    progress2: 'you blew it'
  };
  var mode = {};
	var add = function(user) {
		return $http({
			method:'POST',
			url:'/create',
			data: JSON.stringify(user)
		});
  };

  var deleteAccount = function() {
    return $http({
      method: 'POST',
      url: '/users/delete',
    }).then((res) => {
      console.log(res);
      $location.path('/');
    });
  };

	return {
    mode: mode,
		add: add,
    sensitive: sensitive,
    regular: regular,
    deleteAccount: deleteAccount
	};
});
