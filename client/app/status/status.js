angular.module("app.status", [])

.controller("statusController", function($scope, $http, $location, createFactory) {
  $scope.user = {};
  $scope.finished = false;
  $scope.areYouDone = function() {
    $scope.finished = !$scope.finished;
  };
  $scope.finishGoal = function() {
    $http.post('/finish')
      .success((user) => {
        createFactory.mode = createFactory[user.mode];
        $location.path('/finish')});
  };

  $http.get('/user')
    .success((user) => {
      if (!user) {
        $location.path('/');
      } else if (!user.goal){
        $location.path('/create');
      }
      $scope.mode = createFactory[user.mode];
      $scope.user = user;

      $scope.responses = user.responses.map((tuple) => {
        if (tuple) {
          tuple[0] = moment(tuple[0]).fromNow();
          if (tuple[1] === '1') {
            tuple[1] = $scope.mode.progress1;
          } else if (tuple[1] === '2') {
            tuple[1] = $scope.mode.progress2;
          }
        }
        return tuple;
      }).reverse();

      $scope.progBarStyle = 'width:' + $scope.user.grade + '%;';
      if (user.grade > 70) {
        $scope.progBarClass = 'progress-bar progress-bar-success active';
        $scope.image = 'assets/strippercorn.png';
        $scope.message = $scope.mode.unicornMsg;
      } else if (user.grade > 40) {
        $scope.progBarClass = 'progress-bar progress-bar-warning active';
        $scope.image = 'assets/sloth.png';
        $scope.message = $scope.mode.slothMsg;
      } else {
        $scope.progBarClass = 'progress-bar progress-bar-danger active';
        $scope.image = 'assets/rainbowdash.png';
        $scope.message = $scope.mode.rainbowMsg;
      }

      $scope.createdDate = new Date(user.dateGoalCreated);
      var goalLengthInDays = user.goalLength / (1000*60*60*24)
      $scope.goalCompleteDate = $scope.createdDate.setDate($scope.createdDate.getDate() + goalLengthInDays);

      $scope.countdownToGoal = moment($scope.goalCompleteDate).fromNow();

      console.log($scope.countdownToGoal)


    })
    .error((err) => console.error(err));

  $scope.deleteProfile = function() {
    if(confirm("Are you sure you want to delete your account?")){;

     createFactory.deleteAccount()
      .then(() => {
        $location.path('/');
      })
    }else{
     $location.path('/status')
    }
  };
})
