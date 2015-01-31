'use strict';

var gulp = require('gulp');
var typescript = require('gulp-tsc');
var CLIENT_SRC = 'client-src';
var SERVER_SRC = 'server-src';
var CLIENT_DIST = 'dist/client';
var SERVER_DIST = 'dist/server';
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

gulp.task('images', function() {
    return gulp.src(CLIENT_SRC + '/images/**')
        .pipe(gulp.dest(CLIENT_DIST + '/images/'));
});

gulp.task('bower_components', function() {
    return gulp.src('bower_components/**')
        .pipe(gulp.dest(CLIENT_DIST + '/bower_components'));
});

gulp.task('components-copy', ['bower_components'], function() {
    return gulp.src(CLIENT_SRC + '/components/**')
        .pipe(gulp.dest(CLIENT_DIST + '/components'));
});

gulp.task('components', ['components-copy'], function(callback) {
    var filesToCompile = [];

    walk(path.resolve(CLIENT_DIST + '/components/')).forEach(function(file) {
        if (/\/ts\/index\.ts$/.test(file)) {
            filesToCompile.push(file);
        }
    });

    return merge.apply(null, filesToCompile.map(function(file) {
        console.log(file, 'hello');
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
        if (/\/ts\/index\.ts$/.test(file)) {
            console.log('Removing', file);
            fs.removeFileSync(file);
        }
    });
    callback();
});

gulp.task('copy-server', function() {
    return gulp.src(SERVER_SRC + '/**')
        .pipe(gulp.dest(SERVER_DIST ));
});

gulp.task('server-js', ['copy-server'], function() {
    return gulp.src([
            SERVER_DIST + '/server.ts'
        ])
        .pipe(typescript({
            target: 'ES5',
            module: 'commonjs',
            out: 'server.js'
        }))
        .pipe(gulp.dest(SERVER_DIST + '/'));
});

gulp.task('client', ['html', 'components', 'clean-ts-files', 'images']);
gulp.task('server', ['copy-server', 'server-js']);
gulp.task('default', ['client', 'server']);
