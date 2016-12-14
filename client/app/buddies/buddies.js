angular.module("app.buddies", [])
.controller('buddiesController', function($scope, $http) {
  $http({
    method: 'GET',
    url: '/user',
  }).then(function(user) {
    $scope.user = user;
    $scope.buddies = user.friends;
  });
});
