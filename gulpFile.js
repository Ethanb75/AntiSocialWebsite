'use strict'

const gulp = require('gulp'),
      sass = require('gulp-sass'),
browserify = require('gulp-browserify'),
      gzip = require('gulp-gzip');

gulp.task('sass', function () {
  return gulp.src('./public/css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/build/css'));
});

gulp.task('scripts', function() {
    // Single entry point to browserify 
    gulp.src('./public/js/index.js')
        .pipe(browserify({
          insertGlobals : true,
          debug : !gulp.env.production
        }))
        .pipe(gulp.dest('./public/build/js'));
});
 
gulp.task('compress', function() {
    gulp.src('./public/css/**/*.css')
    .pipe(gzip())
    .pipe(gulp.dest('./public/scripts'));
});
 
gulp.task('default', ['sass', 'scripts', 'compress']);