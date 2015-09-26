define(['angular'], function(angular) {
  'use strict';

  angular.module('gw2wvwTracker', [])
    .controller('MatchupsCtrl', function($scope, $http) {
      $scope.matchups = [];

      $http.get('/ajax/matches')
        .then(function(response) {
          $scope.matchups = response.data;
        });
    });

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['gw2wvwTracker']);
  });
});
