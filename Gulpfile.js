var gulp = require('gulp');

var nodemon = require('gulp-nodemon');

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

gulp.task('nodemon', function () {
  return nodemon({ script: 'app.js' });
});

gulp.task("default", ["test"]);
