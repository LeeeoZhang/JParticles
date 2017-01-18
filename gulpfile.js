const gulp = require('gulp');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

const fs = require('fs');
const pkg = require('./package.json');

const VERSION = pkg.version;
const COPYRIGHT =
`/**
 * Particleground.js v${ VERSION } (https://github.com/Barrior/Particleground.js)
 * Copyright 2016 Barrior <Barrior@qq.com>
 * Licensed under the MIT (https://opensource.org/licenses/mit-license.php)
 */
`;

const devPath = './dev/';
const prodPath = './production/';

// pack pjs on dev environment
gulp.task('pack-pjs', () => {
    gulp.watch([devPath + '*.js'], () => {
        fs.readdir(devPath, (err, files) => {

            files = files.join(' ').replace(/particleground\.js\s|particleground\.all\.js\s/g, '');
            files = ('particleground.js ' + files).split(' ');
            files.forEach((item, i, array) => {
                array.splice(i, 1, devPath + item);
            });

            gulp.src(files)
                .pipe(concat('particleground.all.js'))
                .pipe(gulp.dest(devPath))
        });
    });
});

// build pjs production
gulp.task('build-prod', () => {
    gulp.src(devPath + '*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(uglify())
        .pipe(gulp.dest(prodPath))

        // add Copyright
        .on('end', () => {
            ['particleground.all.js', 'particleground.js']
                .forEach(item => {
                    let filename = prodPath + item;
                    fs.readFile(filename, (err, data) => {
                        let writeData = COPYRIGHT + data.toString();
                        if (!err) {
                            fs.writeFile(filename, writeData, err => {
                                !err && console.log(filename + '【写入成功】');
                            });
                        }
                    });
                });
        });
});

gulp.task('default', ['pack-pjs'], function () {
    // do something else if the pack-pjs task is successful...
});