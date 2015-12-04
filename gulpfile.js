// Gulp plugin setup
var gulp         = require('gulp');
// Watches single files
var watch        = require('gulp-watch');
// Uploads changes to Shopify
var gulpShopify  = require('gulp-shopify-upload');
// Compiles SCSS files
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
// Notifies of errors
var notify = require("gulp-notify");
// Includes the Bourbon Neat libraries
var neat         = require('node-neat').includePaths;
// Grabs your API credentials
var config       = require('config.json');
// Concats your JS files
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
// Optimizes images
var imagemin   = require('gulp-imagemin');
var changed    = require('gulp-changed');

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);

  // Send error to notification center with gulp-notify
  notify.onError({
    title: "Compile Error",
    message: "<%= error %>"
  }).apply(this, args);

  // Keep gulp from hanging on this task
  this.emit('end');
}
 
gulp.task('shopifywatch', function() {
  var options = {
    "basePath": "./Timber/"
  };

  return watch('./Timber/+(assets|layout|config|snippets|templates|locales)/**')
  .pipe(gulpShopify(config.shopify_api_key, config.shopify_api_password, config.shopify_url, null, options));
});

gulp.task('sass', function () {
  gulp.src('./lib/scss/*.{sass,scss}')
    .pipe(sass({includePaths: neat}))
    .on('error', handleErrors)
    .pipe(autoprefixer({ browsers: ['last 2 version'] }))
    .pipe(gulp.dest('./Timber/assets/'));
});

gulp.task('browserify', function() {
  return browserify('./lib/js/app.js')
      .bundle()
      .on('error', handleErrors)
      //Pass desired output filename to vinyl-source-stream
      .pipe(source('bundle.js'))
      // Start piping stream to tasks!
      .pipe(gulp.dest('./Timber/assets/'));
});

gulp.task('images', function() {
  return gulp.src('./lib/images/**')
    .pipe(changed('./Timber/assets/')) // Ignore unchanged files
    .pipe(imagemin()) // Optimize
    .pipe(gulp.dest('./Timber/assets/'))
});

gulp.task('watch', function () {
  gulp.watch('./lib/scss/**/*.scss', ['sass']);
  gulp.watch('./lib/js/**/*.js', ['browserify']);
  gulp.watch('lib/images/*.{jpg,jpeg,png,gif,svg}', ['images']);

  var watcher = watchify(browserify({
    // Specify the entry point of your app
    entries: ['./lib/js/app.js'],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true
  }));

  return watcher.on('update', function() {
    watcher.bundle()
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./Timber/assets/'))
  })
});
 
// Default gulp action when gulp is run
gulp.task('default', ['images', 'shopifywatch', 'watch']);