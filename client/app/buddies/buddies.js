angular.module("app.buddies", [])
.controller('buddiesController', function($scope, $http) {
  $http({
    method: 'GET',
    url: '/user',
  }).then(function(user) {
    $scope.user = user;
    $scope.buddies = user.friends;
  });
}).directive('buddiesDirective', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/buddies/buddiesDirectiveTemplate.html'
  };
});
