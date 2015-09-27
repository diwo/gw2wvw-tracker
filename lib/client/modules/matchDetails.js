define(['angular'], function(angular) {
  'use strict';

  var module = angular.module('matchDetails', []);

  module.controller('MatchDetailsCtrl', function($scope, $routeParams, $http) {
    $scope.chartColours = ['#f7464a', '#6295d9', '#49b377'];

    $http.get('/ajax/matches/' + $routeParams.id)
      .then(function(response) {
        var summary = response.data;

        $scope.red_name = summary.red.name;
        $scope.blue_name = summary.blue.name;
        $scope.green_name = summary.green.name;

        $scope.chartData = [ summary.red.score, summary.blue.score, summary.green.score ];
        $scope.chartLabels = [ summary.red.name, summary.blue.name, summary.green.name ];
      });

    // Stub data
    $scope.updates = [
      { color: 'red', world: 'Ruby', objective: 'Stonemist Castle', map: 'Eternal Battleground' },
      { color: 'blue', world: 'Sapphire', objective: 'NE Tower', map: 'Red Borderland' },
      { color: 'green', world: 'Emerald', objective: 'SW Tower', map: 'Blue Borderland' }
    ];
  });
});
