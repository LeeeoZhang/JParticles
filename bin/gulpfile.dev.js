const gulp = require('gulp');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const wrap = require('./gulp-wrap');

const fs = require('fs');
const devPath = '../dev/';
const destPath = '../production/';

// Compile all scripts.
gulp.task('compile', () => {
    return gulp.src(`${devPath}*.js`)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015', 'stage-0']
        }))
        .pipe(wrap())
        .pipe(sourcemaps.write('./maps/', {
            includeContent: false,
            sourceRoot: `../${devPath}`
        }))
        .pipe(gulp.dest(destPath))

        // Generate 'jparticles.all.js'.
        .on('end', () => {
            fs.readdir(destPath, (err, files) => {

                if (err) return console.error('读取文件目录失败');

                files = files.join(' ').replace(/jparticles(\.all)?\.js\s/g, '');
                files = ('jparticles.js ' + files).split(' ');
                files = files.map(filename => {
                    return destPath + filename;
                });

                gulp.src(files)
                    .pipe(concat('jparticles.all.js'))
                    .pipe(gulp.dest(destPath));
            });
        });
});

gulp.task('default', () => {
    gulp.watch(`${devPath}*.js`, ['compile'], () => {
        // do something else if the task is successful...
    });
});