let gulp  = require('gulp');
let sourcemaps = require('gulp-sourcemaps');
let eslint = require('gulp-eslint');

let sass = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer');
let cssmin = require('gulp-clean-css');

let htmlmin = require('gulp-htmlmin');
let uglify = require('gulp-uglify');
let concat = require('gulp-concat');

const VERSION = '1.0.0';
const COPYRIGHT = `
    Particleground.js v${ VERSION } (https://github.com/Barrior/Particleground.js)
    Copyright 2016 Barrior <Barrior@qq.com>
    Licensed under the MIT (https://opensource.org/licenses/mit-license.php)
`;

gulp.task('sass',function(){
   gulp.src('frontend/sass/site.scss')
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
   gulp.src('frontend/js/site.js')
       .pipe(sourcemaps.init())
       .pipe(uglify())
       .pipe(sourcemaps.write('./map'))
       .pipe(gulp.dest('public/js/'))
});

gulp.task('eslint', function() {
    gulp.src('frontend/js/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
});

gulp.task('default',function(){
    gulp.watch(['frontend/sass/*.scss'],function(){
        gulp.run('sass');
    });
    gulp.watch(['frontend/js/*.js'],function(){
        //装逼失败<(￣︶￣)>
        //gulp.run('eslint');
        gulp.run('js');
    });
});

/*
    pjs dev
 */
gulp.task('build-pjs', function () {
    gulp.src( 'pjs-dev/pjs/*.js' )
        .pipe( uglify() )
        .pipe( gulp.dest( `pjs-production/${ VERSION }/` ) )
});