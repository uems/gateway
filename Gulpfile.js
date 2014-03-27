var gulp = require('gulp');
var mocha = require('gulp-mocha');

var testFiles = [
  'spec/*.spec.js',
  'spec/**/*.spec.js'
];

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

gulp.task("default", function() {
  return gulp.src(testFiles)
    .pipe(mocha({ reporter: "spec" })
    .on("error", handleError));
});
