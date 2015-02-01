'use strict';

var gulp = require('gulp');
var typescript = require('gulp-tsc');
var DIST = 'dist';
var CLIENT_SRC = 'client-src';
var CLIENT_DIST = DIST +'/client';
var SERVER_SRC = 'server-src';
var SERVER_DIST = DIST + '/server';
var COMMON_SRC = 'common-src';
var COMMON_DIST = DIST + '/common';

var path = require('path');
var fs = require('fs');
var merge = require('merge-stream');
var walk = function(dir) {
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if (stat && stat.isDirectory()) results = results.concat(walk(file))
        else results.push(file)
    })
    return results
};


gulp.task('client-js', ['components'], function() {
    return gulp.src([
            CLIENT_SRC + '/ts/the-game.ts'
        ])
        .pipe(typescript({
            target: 'ES5',
            out: 'the-game.js'
        }))
        .pipe(gulp.dest(CLIENT_DIST + '/components/the-game/'));
});

gulp.task('html', function() {
    return gulp.src(CLIENT_SRC + '/pages/*.html')
        .pipe(gulp.dest(CLIENT_DIST + '/'))
});

gulp.task('bower_components', function() {
    return gulp.src('bower_components/**')
        .pipe(gulp.dest(CLIENT_DIST + '/bower_components'));
});

gulp.task('components-copy', ['bower_components'], function() {
    return gulp.src(CLIENT_SRC + '/components/**')
        .pipe(gulp.dest(CLIENT_DIST + '/components'));
});

gulp.task('components', ['components-copy', 'common-js', 'html'], function(callback) {
    var filesToCompile = [];

    walk(path.resolve(CLIENT_DIST + '/components/')).forEach(function(file) {
        if (/\/ts\/index\.ts$/.test(file)) {
            filesToCompile.push(file);
        }
    });

    return merge.apply(null, filesToCompile.map(function(file) {
        console.log('Compiling', file);
        return gulp.src(file)
            .pipe(typescript({
                target: 'ES5',
                out: 'index.js'
            }))
            .pipe(gulp.dest(file.replace(/\/ts\/index\.ts$/, '')));
    }));
});

gulp.task('clean-ts-files', ['components'], function(callback) {
    walk(CLIENT_DIST + '/components').forEach(function(file) {
        if (/\/ts\/.*\.ts$/.test(file)) {
            console.log('Removing', file);
            fs.unlink(file);
        }
    });
    walk(SERVER_DIST + '/').forEach(function(file) {
        if (/\/ts\/.*\.ts$/.test(file)) {
            console.log('Removing', file);
            fs.unlink(file);
        }
    });
    callback();
});

gulp.task('copy-server', function() {
    return gulp.src(SERVER_SRC + '/**')
        .pipe(gulp.dest(SERVER_DIST));
});

gulp.task('common-js', ['copy-common', 'copy-typings'], function() {
    return gulp.src(COMMON_DIST + '/**.ts')
        .pipe(typescript({
            target: 'ES5',
            module: 'commonjs'
        }))
        .pipe(gulp.dest(COMMON_DIST + '/'));
});

gulp.task('copy-typings', function() {
    return gulp.src('typings/**')
        .pipe(gulp.dest(DIST + '/typings/'));
});

gulp.task('copy-common', function() {
    return gulp.src(COMMON_SRC + '/**')
        .pipe(gulp.dest(COMMON_DIST + '/'));
});

gulp.task('server-js', ['copy-server', 'common-js'], function() {
    return gulp.src([
            SERVER_DIST + '/**.ts'
        ])
        .pipe(typescript({
            target: 'ES5',
            module: 'commonjs'
        }))
        .pipe(gulp.dest(SERVER_DIST + '/'));
});

gulp.task('client', ['components', 'clean-ts-files']);
gulp.task('server', ['server-js']);

gulp.task('default', ['client', 'server']);
