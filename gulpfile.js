var gulp = require('gulp'),
    livereload = require('gulp-livereload');

gulp.task('watch', function() {

    livereload.listen();
    gulp.watch(['ladoudou/**']).on('change', function(file) {
        livereload.changed(file.path);
    });

});