const fs = require('fs');
const gulp = require('gulp');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const changed = require('gulp-changed');
const browserSync = require('browser-sync').create();
const wrap = require('./gulp-wrap');

const devPath = '../dev/';
const destPath = '../production/';
const reload = browserSync.reload;

// Compile all scripts.
gulp.task('compile', () => {
    return gulp.src(`${devPath}*.js`)
        .pipe(changed(destPath))
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
        .pipe(reload({stream: true}))

        // Generate 'jparticles.all.js'.
        .on('end', () => {
            fs.readdir(destPath, (err, files) => {
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

// Static service.
gulp.task('service', ['compile'], () => {

    browserSync.init({
        server: {
            baseDir: ['../', '../samples/']
        },
        startPath: '/particle.html',
        injectChanges: false
    });

    gulp.watch(`${devPath}*.js`, ['compile']);
    gulp.watch('../samples/**/*.@(html|css|js)').on('change', reload);
});

gulp.task('default', ['service']);