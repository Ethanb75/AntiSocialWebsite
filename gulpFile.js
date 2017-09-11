'use strict'

const gulp = require('gulp'),
      sass = require('gulp-sass'),
browserify = require('gulp-browserify'),
    useref = require('gulp-useref'),
  cleanCSS = require('gulp-clean-css'),
   htmlmin = require('gulp-htmlmin'),
    uglify = require('gulp-uglify'),
      gzip = require('gulp-gzip');

gulp.task('sass', function () {
  return gulp.src('./src/css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gzip())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('css', function() {
  return gulp.src('./src/css/*.css')
    .pipe(cleanCSS())
    .pipe(gzip())
    .pipe(gulp.dest('./public/css'));
})

gulp.task('html', function() {
  return gulp.src('./src/*.html')
    .pipe(htmlmin())
    .pipe(gzip())
    .pipe(gulp.dest('./public'));
})

gulp.task('scripts', function() {
    // Single entry point to browserify 
    gulp.src('./src/js/*.js')
        .pipe(browserify({
          insertGlobals : true,
          debug : !gulp.env.production
        }))
        // .pipe(uglify())
        .pipe(gzip())
        .pipe(gulp.dest('./public/js'));
});


 
// gulp.task('file concat', function () {
//     return gulp.src('./src/*.html')
//         .pipe(useref())
//         .pipe(gulp.dest('./public'));
// });
 
gulp.task('default', ['sass', 'css', 'html', 'scripts']);