angular.module("app.status", [])

.controller("statusController", function($scope, $http, $location) {
  $scope.user = {};
  $scope.finished = false;
  $scope.areYouDone = function() {
    $scope.finished = !$scope.finished;
  };
  $scope.finishGoal = function() {
    $http.post('/finish')
      .success((user) => $location.path('/finish'));
  };

  $http.get('/user')
    .success((user) => {
      if (!user) {
        $location.path('/');
      }
      $scope.user = user;

      $scope.responses = user.responses.map((tuple) => {
        if (tuple) {
          tuple[0] = moment(tuple[0]).fromNow();
          if (tuple[1] === '1') {
            tuple[1] = 'you didn\'t suck';
          } else if (tuple[1] === '2') {
            tuple[1] = 'you blew it';
          }
        }
        return tuple;
      }).reverse();

      $scope.progBarStyle = 'width:' + $scope.user.grade + '%;';
      if (user.grade > 70) {
        $scope.progBarClass = 'progress-bar progress-bar-success active';
        $scope.image = 'assets/strippercorn.png';
        $scope.message = 'This unicorn stripper is here to tell you what a great job you\'re doing!';
      } else if (user.grade > 40) {
        $scope.progBarClass = 'progress-bar progress-bar-warning active';
        $scope.image = 'assets/sloth.png';
        $scope.message = 'Take this sloth\'s vacant stare as an indication of how perfectly average we find you.';
      } else {
        $scope.progBarClass = 'progress-bar progress-bar-danger active';
        $scope.image = 'assets/rainbowdash.png';
        $scope.message = 'Rainbow dash is incredibly dissappointed in your performance. Get your shit together...';
      }
    })
    .error((err) => console.error(err));

});
