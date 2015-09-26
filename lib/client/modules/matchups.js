define(['angular'], function(angular) {
  'use strict';

  var module = angular.module('matchups', []);

  module.controller('MatchupsCtrl', function($scope, $http, $location) {
    $http.get('/ajax/matches')
      .then(function(response) {
        $scope.matchups = response.data;
      });

    $scope.openDetails = function(idx) {
      $location.path('/matches/' + $scope.matchups[idx].wvw_match_id);
    };
  });
});
