define([
  'angular', 'angularRoute', 'angularChart',
  'modules/matchups', 'modules/matchDetails'
], function(angular) {
  'use strict';

  var module = angular.module('gw2wvwTracker', [
    'ngRoute', 'chart.js', 'matchups', 'matchDetails'
  ]);

  module.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/matches', {
        templateUrl: '/partials/matches',
        controller: 'MatchupsCtrl'
      })
      .when('/matches/:id', {
        templateUrl: '/partials/matchDetails',
        controller: 'MatchDetailsCtrl'
      })
      .otherwise({ redirectTo: '/matches' });
  }]);

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['gw2wvwTracker']);
  });
});
