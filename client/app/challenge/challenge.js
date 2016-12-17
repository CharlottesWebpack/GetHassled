angular.module("app.challenge", [])
.controller("challengeController", function($scope, $http) {

  $http({
    method: 'GET',
    url: '/user'
  }).then(function(user) {
    console.log('this is the init get for user: ', user);
    $scope.user = user.data;
    // $scope.newChallenge.challenger1Name = user.data.name;
  }).catch(function(err) {
    console.log(err);
  });

  $scope.getChallenges = function() {
    console.log('this is getchallenges');
    $http({
      method: 'GET',
      url: '/challenge'
    }).then(function(challenges) {
      console.log(challenges);
      $scope.challenges = challenges;
    }).catch(function(err) {
      console.log(err);
    });
  };
  $scope.getChallenges();

  $scope.addChallenge = function() {
    $scope.newChallenge.challenger1Name = $scope.user.name;
    $http({
      method: 'POST',
      url: '/challenge',
      data: $scope.newChallenge
    }).then(function(challenge) {
      console.log(challenge);
    }).catch(function(err) {
      console.log('this is an err from addChallenge: ', err);
    });
  };
});
