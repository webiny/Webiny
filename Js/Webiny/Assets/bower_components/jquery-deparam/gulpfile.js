var uglify = require('gulp-uglify');
var gulp = require('gulp');
 
gulp.task('compress', function() {
  gulp.src('jquery-deparam.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['compress']);
