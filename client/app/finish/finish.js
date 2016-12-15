angular.module("app.finish", [])

.controller("finishController", function($scope, $location, createFactory) {
  $scope.mode = createFactory.mode;
  $scope.setGoal = function() {
    $location.path('/create');
  };
});
