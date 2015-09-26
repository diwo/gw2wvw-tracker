define(['angular'], function(angular) {
  'use strict';

  var module = angular.module('controllers', []);

  module.controller('MatchupsCtrl', function($scope, $http) {
    $http.get('/ajax/matches')
      .then(function(response) {
        $scope.matchups = response.data;
      });
  });
});
