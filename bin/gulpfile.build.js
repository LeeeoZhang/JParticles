const gulp = require('gulp');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const through = require('through2');

const fs = require('fs');
const pkg = require('../package.json');

const VERSION = pkg.version;
const COPYRIGHT =
`/**
 * JParticles v${VERSION} (https://github.com/Barrior/JParticles)
 * Copyright 2016-present Barrior <Barrior@qq.com>
 * Licensed under the MIT (https://opensource.org/licenses/MIT)
 */
`;

const path = '../production/';
const regExp = /jparticles(\.all)?\.js/;

// Build JParticles.
gulp.task('build', () => {
    gulp.src(`${path}*.js`)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(uglify())
        .pipe(through.obj((file, encoding, callback) => {

            if (regExp.test(file.path)) {
                let content = file.contents.toString();
                content = COPYRIGHT + content;
                file.contents = new Buffer(content);
            }

            callback(null, file);
        }))
        .pipe(gulp.dest(path));
});

gulp.task('default', ['build'], () => {
    // do something else if the build task is successful...
});