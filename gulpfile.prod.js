const gulp = require('gulp');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

const fs = require('fs');
const pkg = require('./package.json');

const VERSION = pkg.version;
const COPYRIGHT =
`/**
 * JParticles v${ VERSION } (https://github.com/Barrior/JParticles)
 * Copyright 2016 Barrior <Barrior@qq.com>
 * Licensed under the MIT (https://opensource.org/licenses/MIT)
 */
`;

const path = './production/';

// Building JParticles.
gulp.task('build', () => {
    gulp.src('./dev/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(uglify())
        .pipe(gulp.dest(path))

        // Add Copyright.
        .on('end', () => {
            ['jparticles.all.js', 'jparticles.js']
                .forEach(item => {
                    let filename = path + item;
                    fs.readFile(filename, (err, data) => {
                        let writeData = COPYRIGHT + data.toString();
                        if (!err) {
                            fs.writeFile(filename, writeData, err => {
                                !err && console.log(filename + ' 版权信息【写入成功】');
                            });
                        }
                    });
                });
        });
});

gulp.task('default', ['build'], () => {
    // do something else if the build task is successful...
});