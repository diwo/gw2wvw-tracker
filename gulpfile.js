'use strict';

var config = require('./package.json');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');

var path = {
  js: ['lib/**/*.js', 'gulpfile.js']
};

gulp.task('default', ['lint']);

gulp.task('lint', () =>
  gulp.src(path.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
);

gulp.task('nodemon', () => {
  nodemon({
    script: config.main,
    args: ['8080'],
    ext: 'js',
    tasks: ['lint']
  });
});
