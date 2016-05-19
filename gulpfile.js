var gulp  = require('gulp');
var sourcemaps = require('gulp-sourcemaps');

var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-clean-css');

var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');


gulp.task('sass',function(){
   gulp.src('dev/sass/*.scss')
       .pipe(sourcemaps.init())
       .pipe(
           sass({
               outputStyle: 'expanded'
           })
       )
       .pipe(
           autoprefixer({
               browsers: [ 'IE >= 9', 'Firefox > 10', 'chrome > 10' ]
           })
       )
       .pipe(cssmin())
       .pipe(sourcemaps.write('./map'))
       .pipe(gulp.dest('public/css/'))
});

gulp.task('js',function(){
   gulp.src('dev/js/**/*.js')
       .pipe(sourcemaps.init())
       .pipe(uglify())
       .pipe(sourcemaps.write('./map'))
       .pipe(gulp.dest('public/js/'))
});

gulp.task('default',function(){
    gulp.watch(['dev/sass/*.scss'],function(){
        gulp.run('sass');
    });
    gulp.watch(['dev/js/**/*.js'],function(){
        gulp.run('js');
    });
});