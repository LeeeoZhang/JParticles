const gulp = require('gulp');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');

const fs = require('fs');
const devPath = './dev/';
const destPath = './production/';

const UMDHeader = `
(function (factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        factory();
    }
}(function () {
`;

const UMDFooter = `
    // AMD 加载方式放在头部，factory 函数会比后面的插件延迟执行
    // 导致后面的插件找不到 JParticles 对象而报错
    if (typeof define === 'function' && define.amd) {
        define(() => {
            return JParticles;
        });
    } else {
        return JParticles;
    }
}));
`;

const pluginWrap = `+function () { ${content} }()`;

// Concatenate all js to generating 'jparticles.all.js' at production directory.
gulp.task('concat', ['compile'], () => {
    fs.readdir(destPath, (err, files) => {

        files = files.join(' ').replace(/jparticles(\.all)?\.js\s/g, '');
        files = ('jparticles.js ' + files).split(' ');
        files = files.map(filename => {
            return destPath + filename;
        });

        gulp.src(files)
            .pipe(concat('jparticles.all.js'))
            .pipe(gulp.dest(destPath))
    });
});

gulp.task('compile', (cb) => {
    return gulp.src(`${devPath}*.js`)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015', 'stage-0']
        }))
        .pipe(sourcemaps.write('./maps/', {
            includeContent: false,
            sourceRoot: `../${devPath}`
        }))
        .pipe(gulp.dest(destPath));
    // cb();
});

gulp.task('default', () => {
    gulp.watch(`${devPath}*.js`, ['concat'], () => {
        // do something else if the task is successful...
    });
});