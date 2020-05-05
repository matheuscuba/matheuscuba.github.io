const gulp = require('gulp');
const less = require('gulp-less');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const minify = require('gulp-minify');
const browsersync = require('browser-sync').create();

const configs = {
    less: {
        watch: './less/*.less',
        compile: './less/[^_]*.less',
        output: './dist/css/',
    },
    js: {
        watch: './js/*.js',
        output: './dist/js/',
    },
};

function javascript() {
    return gulp
        .src(configs.js.watch)
        .pipe(plumber())
        .pipe(minify({ext: {min: '.min.js'}, noSource: true}))
        .pipe(gulp.dest(configs.js.output))
        .pipe(browsersync.stream());
}

function css() {
    return gulp
        .src(configs.less.compile)
        .pipe(plumber())
        .pipe(less())
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(configs.less.output))
        .pipe(browsersync.stream());
}

exports.default = function () {
    browsersync.init({
        server: './',
    });

    gulp.watch(configs.less.watch, css);
    gulp.watch(configs.js.watch, javascript);
};
