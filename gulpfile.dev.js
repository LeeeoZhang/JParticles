const gulp = require('gulp');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

const fs = require('fs');
const path = './dev/';

// Pack all js to generating 'jparticles.all.js' at dev directory.
gulp.task('pack', () => {
    gulp.watch([path + '*.js'], () => {
        fs.readdir(path, (err, files) => {

            files = files.join(' ').replace(/jparticles\.js\s|jparticles\.all\.js\s/g, '');
            files = ('jparticles.js ' + files).split(' ');
            files.forEach((item, i, array) => {
                array.splice(i, 1, path + item);
            });

            gulp.src(files)
                .pipe(concat('jparticles.all.js'))
                .pipe(gulp.dest(path))
        });
    });
});

gulp.task('default', ['pack'], () => {
    // do something else if the pack task is successful...
});