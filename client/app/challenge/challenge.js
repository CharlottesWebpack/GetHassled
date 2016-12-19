angular.module("app.challenge", [])
.controller("challengeController", function($scope, $http) {

  $http({
    method: 'GET',
    url: '/user'
  }).then(function(user) {
    $scope.user = user.data;
  }).catch(function(err) {
    console.log(err);
  });

  $scope.getChallenges = function() {
    $http({
      method: 'GET',
      url: '/challenge'
    }).then(function(challenges) {
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
      $scope.getChallenges();
    }).catch(function(err) {
      console.log('this is an err from addChallenge: ', err);
    });
  };

  $scope.completeChallenge = function(challengeId) {
    $http({
      method: 'POST',
      url: '/deleteChallenge',
      data: {
        '_id': challengeId,
        'winner': $scope.user.phoneNumber,
      }
    }).then(function(res) {
      $scope.getChallenges();
      console.log(res);
    }).catch(function(err) {
      console.log(err);
    });
  };
});
