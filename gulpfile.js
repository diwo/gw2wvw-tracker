'use strict';

var config = require('./package.json');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jasmine = require('gulp-jasmine');
var nodemon = require('gulp-nodemon');

var path = {
  js: ['lib/**/*.js', 'gulpfile.js'],
  tests: ['test/**/*.test.js']
};

gulp.task('default', ['test']);
gulp.task('test', ['lint', 'jasmine']);

gulp.task('lint', () =>
  gulp.src(path.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
);

gulp.task('jasmine', () =>
  gulp.src(path.tests)
    .pipe(jasmine())
);

gulp.task('nodemon', () => {
  nodemon({
    script: config.main,
    args: ['8080'],
    ext: 'js',
    tasks: ['lint']
  });
});
