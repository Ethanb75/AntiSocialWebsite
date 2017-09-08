'use strict'

const gulp = require('gulp'),
      sass = require('gulp-sass'),
browserify = require('gulp-browserify'),
    useref = require('gulp-useref'),
      gzip = require('gulp-gzip');

gulp.task('sass', function () {
  return gulp.src('./src/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('scripts', function() {
    // Single entry point to browserify 
    gulp.src('./src/index.js')
        .pipe(browserify({
          insertGlobals : true,
          debug : !gulp.env.production
        }))
        .pipe(gulp.dest('./public/js'));
});


 
// gulp.task('file concat', function () {
//     return gulp.src('./src/*.html')
//         .pipe(useref())
//         .pipe(gulp.dest('./public'));
// });
 
// gulp.task('compress', function() {
//     gulp.src('./public/css/**/*.css')
//     .pipe(gzip())
//     .pipe(gulp.dest('./public/scripts'));
// });
 
gulp.task('default', ['sass', 'scripts']);