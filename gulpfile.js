'use strict';

var config = require('./package.json');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jasmine = require('gulp-jasmine');
var nodemon = require('gulp-nodemon');

const PATH = {
  js: ['lib/**/*.js', 'test/**/*.js', 'gulpfile.js'],
  unittests: ['test/unit/**/*.test.js'],
  itests: ['test/itest/**/*.itest.js']
};

const JASMINE_CONFIG = {
  timeout: 2000,
  verbose: false
};

gulp.task('default', ['test']);
gulp.task('test', ['lint', 'unittest']);

gulp.task('lint', () =>
  gulp.src(PATH.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
);

gulp.task('unittest', () =>
  gulp.src(PATH.unittests)
    .pipe(jasmine(JASMINE_CONFIG))
);

// Can't run concurrently with `unittest` due to gulp-jasmine bug
// https://github.com/sindresorhus/gulp-jasmine/issues/42
gulp.task('itest', () =>
  gulp.src(PATH.itests)
    .pipe(jasmine(JASMINE_CONFIG))
);

gulp.task('nodemon', () => {
  nodemon({
    script: config.main,
    args: ['8080'],
    watch: 'lib/server',
    ext: 'js',
    tasks: ['lint']
  });
});
