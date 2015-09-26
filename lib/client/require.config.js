(function() {
  'use strict';

  requirejs.config({
    baseUrl: '/js',
    paths: {
      'angular': '/vendor/angular',
      'angularRoute': '/vendor/angular-route',
      'jquery': '/vendor/jquery-2.1.4',
      'bootstrap': '/vendor/bootstrap-3.3.5-dist/js/bootstrap'
    },
    shim: {
      'angular': { exports: 'angular' },
      'angularRoute': ['angular'],
      'bootstrap': ['jquery']
    }
  });
})();
