define(['angular', 'angularRoute', 'controllers'], function(angular) {
  'use strict';

  var module = angular.module('gw2wvwTracker', ['ngRoute', 'controllers']);

  module.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/matches', {
        templateUrl: '/partials/matches',
        controller: 'MatchupsCtrl'
      })
      .otherwise({ redirectTo: '/matches' });
  }]);

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['gw2wvwTracker']);
  });
});
