'use strict'

const gulp = require('gulp'),
        sass = require('gulp-sass');

gulp.task('sass', function () {
  return gulp.src('./public/css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./public/css/*.scss', ['sass']);
});



gulp.task('default', ['sass', 'sass:watch']);