angular.module('app.service', [])

.factory('createFactory',  function($http) {
	var add = function(user) {
		return $http({
			method:'POST',
			url:'/create',
			data: JSON.stringify(user)
		});
  };

	return {
		add: add
	};
});
