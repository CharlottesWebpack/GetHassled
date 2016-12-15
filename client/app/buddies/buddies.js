angular.module("app.buddies", [])
.controller('buddiesController', function($scope, $http, createFactory, $location) {
  $http({
    method: 'GET',
    url: '/user',
  }).then(function(res) {
    if (res.data){
      $scope.user = res.data;
      $scope.mode = createFactory[$scope.user.mode];
      $scope.buddies = $scope.user.friends;
    } else {
      $location.path('/');
    }
  });
}).directive('buddiesDirective', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/buddies/buddiesDirectiveTemplate.html'
  };
});
