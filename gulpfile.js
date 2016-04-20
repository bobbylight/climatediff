'use strict';

var gulp = require('gulp');
var debug = require('gulp-debug');
var del = require('del');
var less = require('gulp-less');
var runSequence = require('run-sequence');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
//var minifyHtml = require('gulp-minify-html');
var concatCss = require('gulp-concat-css');
var cssnano = require('gulp-cssnano');
var rev = require('gulp-rev');
var tsc = require('gulp-typescript');
var tsconfig = tsc.createProject('tsconfig.json');
var sourcemaps = require('gulp-sourcemaps');
var tslint = require('gulp-tslint');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var merge = require('merge2');
var livereload = require('gulp-livereload');

gulp.task('clean', function() {
    return del([
        './dist'
    ]);
});

gulp.task('less', function() {
    return gulp.src('src/css/*.less')
        .pipe(less())
        .pipe(gulp.dest('src/css'))
        .pipe(livereload());
});

gulp.task('usemin', function() {
    return gulp.src([ 'src/index.php' ])
        .pipe(debug({ title: 'File going through usemin: ' }))
        .pipe(usemin({
            css: [ rev ],
            js: [ uglify, rev ],
            inlinejs: [ uglify ]
            //, html: [ minifyHtml({ empty: true }) ]
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('cssmin', function() {
    gulp.src('src/css/all.css')
        .pipe(concatCss('all.css'))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('compile-ts', function() {
    var tsResult = gulp.src([ 'src/app/**/*.ts', 'typings/browser.d.ts' ])
        .pipe(sourcemaps.init())
        .pipe(tsc(tsconfig));
    return merge([
        tsResult.dts.pipe(gulp.dest('src/js/')),
        tsResult.js
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('src/js/'))
    ]);
});
gulp.task('tslint', function() {
    return gulp.src([ 'src/app/**/*.ts' ])
        .pipe(tslint())
        .pipe(tslint.report('prose'));
});

gulp.task('jshint', function() {
    return gulp.src([ 'src/**/*.js' ])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});
gulp.task('-jshint-without-failing', function() {
    return gulp.src([ 'src/**/*.js' ])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('copy-non-minified-files', function() {
    return gulp.src([ 'src/**', 'src/.htaccess', '!src/css/**', '!src/js/**', '!src/index.php' ])
        .pipe(gulp.dest('dist/'));
});

gulp.task('-watch-ts-sequential-actions', function() {
    runSequence('tslint', 'compile-ts', '-jshint-without-failing');
});
gulp.task('watch', [ 'less', '-watch-ts-sequential-actions' ], function() {
    livereload.listen();
    gulp.watch('src/app/**/*.ts', [ '-watch-ts-sequential-actions' ]);
    gulp.watch('src/css/*.less', [ 'less' ]);
});

gulp.task('default', function() {
    runSequence('less', 'tslint', 'clean', 'compile-ts', 'jshint', 'usemin', 'cssmin', 'copy-non-minified-files');
});
