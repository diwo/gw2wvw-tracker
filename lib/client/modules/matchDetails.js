define(['angular'], function(angular) {
  'use strict';

  var module = angular.module('matchDetails', []);

  module.controller('MatchDetailsCtrl', function($scope, $routeParams) {
    $scope.matchId = $routeParams.id;
  });
});
