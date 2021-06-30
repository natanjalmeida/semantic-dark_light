/*******************************
          Build Task
*******************************/

var
  gulp = require('gulp'),

  // node dependencies
  console = require('better-console'),
  fs = require('fs'),

  // gulp dependencies
  autoprefixer = require('gulp-autoprefixer'),
  chmod = require('gulp-chmod'),
  clone = require('gulp-clone'),
  flatten = require('gulp-flatten'),
  gulpif = require('gulp-if'),
  less = require('gulp-less'),
  minifyCSS = require('gulp-clean-css'),
  plumber = require('gulp-plumber'),
  print = require('gulp-print').default,
  rename = require('gulp-rename'),
  replace = require('gulp-replace'),
  runSequence = require('run-sequence'),
  sourcemaps = require('gulp-sourcemaps'),
  stripCssComments = require('gulp-strip-css-comments'),


  // config
  config = require('../config/user'),
  tasks = require('../config/tasks'),
  install = require('../config/project/install'),
  // shorthand
  globs = config.globs,
  assets = config.paths.assets,
  output = config.paths.output,
  source = config.paths.source,

  banner = tasks.banner,
  comments = tasks.regExp.comments,
  log = tasks.log,
  settings = tasks.settings
  ;

// add internal tasks (concat release)
require('../collections/internal')(gulp);

module.exports = function (callback) {

  var
    tasksCompleted = 0,
    maybeCallback = function () {
      tasksCompleted++;
      if (tasksCompleted === 2) {
        callback();
      }
    },

    stream,
    compressedStream,
    uncompressedStream
    ;

  console.info('Building CSS');

  if (!install.isSetup()) {
    console.error('Cannot build files. Run "gulp install" to set-up Semantic');
    return;
  }

  // unified css stream
  stream = gulp.src(source.src + '/semantic.less')
    // .pipe(plumber(settings.plumber.less))
    // .pipe(sourcemaps.init())
    .pipe(less(settings.less))
    .pipe(autoprefixer(settings.prefix))
    .pipe(replace(comments.variables.in, ''))
    .pipe(replace(comments.license.in, ''))
    .pipe(replace(comments.large.in, ''))
    .pipe(replace(comments.small.in, ''))
    .pipe(replace(comments.tiny.in, ''))
    .pipe(flatten())
    ;

  // two concurrent streams from same source to concat release
  // uncompressedStream = stream.pipe(clone());
  compressedStream = stream.pipe(clone());

  // uncompressed component css
  // uncompressedStream
  // .pipe(plumber())
  // .pipe(replace(assets.source, assets.uncompressed))
  // .pipe(gulpif(config.hasPermission, chmod(config.permission)))
  // .pipe(gulp.dest(output.packaged))
  // .pipe(print(log.created))
  // .on('end', function() {
  //   runSequence('package uncompressed css', maybeCallback);
  // })
  // ;

  // compressed component css
  compressedStream
    // .pipe(plumber())
    .pipe(clone())
    .pipe(replace(assets.source, assets.compressed))
    .pipe(gulpif(settings.compressed, minifyCSS(settings.minify)))
    .pipe(rename(settings.rename.minCSS))
    .pipe(gulpif(config.hasPermission, chmod(config.permission)))
    // .pipe(sourcemaps.write('.'))
    .pipe(stripCssComments())
    .pipe(gulp.dest(output.packaged))
    .pipe(print(log.created))
    // .on('end', function() {
    //   runSequence('package compressed css', maybeCallback);
    // })
    ;

};
