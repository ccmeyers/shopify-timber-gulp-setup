// Gulp plugin setup
var gulp = require('gulp');
// Watches single files
var watch = require('gulp-watch');
var gulpShopify = require('gulp-shopify-upload');
// Grabs your API credentials
var config = require('config.json');
 
gulp.task('shopifywatch', function() {
  var options = {
    "basePath": "./Timber/"
  };

  return watch('./Timber/+(assets|layout|config|snippets|templates|locales)/**')
  .pipe(gulpShopify(config.shopify_api_key, config.shopify_api_password, config.shopify_url, null, options));
});
 
// Default gulp action when gulp is run
gulp.task('default', [
  'shopifywatch'
]);