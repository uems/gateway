var gulp = require('gulp');
var mocha = require('gulp-mocha');

var testFiles = [
  'spec/*.spec.js',
  'spec/**/*.spec.js'
];

gulp.task('default', function () {
    gulp.src(testFiles)
        .pipe(mocha({reporter: 'nyan'}));
});
