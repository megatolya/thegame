var gulp = require('gulp');
var typescript = require('gulp-tsc');
var CLIENT_SRC = 'client-src';
var SERVER_SRC = 'server-src';
var CLIENT_DIST = 'dist/client';
var SERVER_DIST = 'dist/server';

gulp.task('client-js', function() {
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

gulp.task('components', ['client-js'], function() {
    gulp.src('bower_components/**')
        .pipe(gulp.dest(CLIENT_DIST + '/bower_components'));
    gulp.src(CLIENT_SRC + '/components/**')
        .pipe(gulp.dest(CLIENT_DIST + '/components'));
});


gulp.task('copy-server', function() {
    gulp.src(SERVER_SRC + '/**')
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

gulp.task('client', ['html', 'client-js', 'components', 'images']);
gulp.task('server', ['copy-server', 'server-js']);
gulp.task('default', ['client', 'server']);
