angular.module("app.finish", [])

.controller("finishController", function($scope, $location) {
  $scope.setGoal = function() {
    $location.path('/create');
  };
});
