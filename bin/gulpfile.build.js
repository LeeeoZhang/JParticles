const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const through = require('through2');
const wrap = require('./gulp-wrap');

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

const devPath = '../dev/';
const destPath = '../production/';
const matchFile = /jparticles(\.all)?\.js/;
const excludeFile = /(jparticles(\.all)?\.js|maps)\s/g;

gulp.task('compile', () => {
    return gulp.src(`${devPath}*.js`)
        .pipe(babel({
            presets: ['es2015', 'stage-0']
        }))
        .pipe(wrap())
        .pipe(gulp.dest(destPath));
});

gulp.task('package', ['compile'], () => {
    let files = fs.readdirSync(destPath);

    files = files.join(' ').replace(excludeFile, '');
    files = ('jparticles.js ' + files).split(' ');
    files = files.map(filename => {
        return destPath + filename;
    });

    return gulp.src(files)
        .pipe(concat('jparticles.all.js'))
        .pipe(gulp.dest(destPath));
});

// Build JParticles.
gulp.task('build', ['package'], () => {
    return gulp.src(`${destPath}*.js`)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(uglify())
        .pipe(through.obj((file, encoding, callback) => {

            if (matchFile.test(file.path)) {
                let content = file.contents.toString();
                content = COPYRIGHT + content;
                file.contents = new Buffer(content);
            }

            callback(null, file);
        }))
        .pipe(gulp.dest(destPath));
});

gulp.task('default', ['build']);