var gulp = require('gulp');

var mocha   = require('gulp-mocha'),
    nodemon = require('gulp-nodemon')


var testFiles = [
  'spec/*.spec.js',
  'spec/**/*.spec.js'
];

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

gulp.task("test", function() {
  return gulp.src(testFiles)
    .pipe(mocha({ reporter: "spec" })
    .on("error", handleError));
});

gulp.task('nodemon', function () {
  return nodemon({ script: 'app.js'})
});

gulp.task("default", ["test"]);
