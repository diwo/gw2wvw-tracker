(function() {
  'use strict';

  requirejs.config({
    baseUrl: '/js',
    paths: {
      'angular': '/vendor/angular',
      'jquery': '/vendor/jquery-2.1.4',
      'bootstrap': '/vendor/bootstrap-3.3.5-dist/js/bootstrap'
    },
    shim: {
      'bootstrap': {
        deps: ['jquery']
      },
      'angular': {
        exports: 'angular'
      }
    }
  });
})();
