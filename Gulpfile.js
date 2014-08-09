var gulp = require('gulp');
var typescript = require('gulp-tsc');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');

gulp.task('js', function() {
    return gulp.src('src/ts/**.ts')
        .pipe(typescript({target: 'ES5'}))
        .pipe(gulp.dest('dist'));
});

gulp.task('templates', function() {
    return gulp.src('./src/jade/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('./dist/'))
});

gulp.task('images', function() {
    return gulp.src('./src/images/**')
        .pipe(gulp.dest('./dist/images/'));
});

gulp.task('styles', function() {
    gulp.src('./src/styl/*.styl')
        .pipe(stylus())
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('default', ['templates', 'js', 'images', 'styles']);
