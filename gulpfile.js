'use strict';

var config = require('./package.json');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jasmine = require('gulp-jasmine');
var nodemon = require('gulp-nodemon');

var path = {
  js: ['lib/**/*.js', 'test/**/*.js', 'gulpfile.js'],
  unittests: ['test/unit/**/*.test.js'],
  itests: ['test/itest/**/*.test.js']
};

gulp.task('default', ['test']);
gulp.task('test', ['lint', 'unittest']);

gulp.task('lint', () =>
  gulp.src(path.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
);

gulp.task('unittest', () =>
  gulp.src(path.unittests)
    .pipe(jasmine())
);

// Can't run concurrently with `unittest` due to gulp-jasmine bug
// https://github.com/sindresorhus/gulp-jasmine/issues/42
gulp.task('itest', () =>
  gulp.src(path.itests)
    .pipe(jasmine())
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
