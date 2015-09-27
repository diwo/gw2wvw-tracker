define(['angular'], function(angular) {
  'use strict';

  var module = angular.module('matchDetails', []);

  module.controller('MatchDetailsCtrl', function($scope, $routeParams) {
    /* jshint devel:true */
    console.debug('matchid: ', $routeParams.id);

    $scope.red_name = 'Ruby';
    $scope.blue_name = 'Sapphire';
    $scope.green_name = 'Emerald';

    $scope.updates = [
      { color: 'red', world: 'Ruby', objective: 'Stonemist Castle', map: 'Eternal Battleground' },
      { color: 'blue', world: 'Sapphire', objective: 'NE Tower', map: 'Red Borderland' },
      { color: 'green', world: 'Emerald', objective: 'SW Tower', map: 'Blue Borderland' }
    ];

    $scope.chartColours = ['#F7464A', '#6295D9', '#49B377'];
    $scope.chartData = [1, 2, 3];
    $scope.chartLabels = ['Ruby', 'Sapphire', 'Emerald'];
  });
});
