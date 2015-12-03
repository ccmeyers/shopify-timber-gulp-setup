// Gulp plugin setup
var gulp         = require('gulp');
// Watches single files
var watch        = require('gulp-watch');
var gulpShopify  = require('gulp-shopify-upload');
var sass         = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var neat         = require('node-neat').includePaths;
// Grabs your API credentials
var config       = require('config.json');
 
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
    .pipe(gulp.dest('./Timber/assets/'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./lib/scss/**/*.{sass,scss}', ['sass']);
});
 
// Default gulp action when gulp is run
gulp.task('default', [
  'shopifywatch', 'sass:watch'
]);