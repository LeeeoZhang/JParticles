const gulp = require('gulp');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');

const fs = require('fs');
const devPath = './dev/';
const destPath = './production/';

// Pack all js to generating 'jparticles.all.js' at dev directory.
gulp.task('pack', () => {
    gulp.watch([devPath + '*.js'], () => {
        fs.readdir(devPath, (err, files) => {

            files = files.join(' ').replace(/jparticles\.js\s|jparticles\.all\.js\s/g, '');
            files = ('jparticles.js ' + files).split(' ');
            files.forEach((item, i, array) => {
                array.splice(i, 1, devPath + item);
            });

            gulp.src(files)
                .pipe(concat('jparticles.all.js'))
                .pipe(gulp.dest(devPath))
        });
    });
});

gulp.task('compile', () => {
    gulp.src(devPath + '*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(sourcemaps.write('./maps/', {
            includeContent: false,
            sourceRoot: '../../dev'
        }))
        .pipe(gulp.dest(destPath));
});

gulp.task('default', ['pack', 'compile'], () => {
    // do something else if the pack task is successful...
});