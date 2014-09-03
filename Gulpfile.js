var gulp = require('gulp');
var typescript = require('gulp-tsc');

gulp.task('js', function() {
    return gulp.src([
            'src/ts/game.ts'
        ])
        .pipe(typescript({
            target: 'ES5',
            out: 'the-game.js'
        }))
        .pipe(gulp.dest('dist/components/the-game/'));
});

gulp.task('html', function() {
    return gulp.src('./src/pages/*.html')
        .pipe(gulp.dest('./dist/'))
});

gulp.task('images', function() {
    return gulp.src('./src/images/**')
        .pipe(gulp.dest('./dist/images/'));
});

gulp.task('components', function() {
    gulp.src('./bower_components/**')
        .pipe(gulp.dest('./dist/bower_components'));
    gulp.src('./src/components/**')
        .pipe(gulp.dest('./dist/components'));
});

gulp.task('default', ['components', 'html', 'js', 'images']);
