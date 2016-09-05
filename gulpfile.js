'use strict';

var gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    postcss       = require('gulp-postcss'),
    autoprefixer  = require('gulp-autoprefixer'),
    sourcemaps    = require('gulp-sourcemaps'),
    browserSync   = require('browser-sync').create(),
    runSequence   = require('run-sequence'),
    plumber       = require('gulp-plumber'),
    coffee        = require('gulp-coffee'),
    useref        = require('gulp-useref'),
    uglify        = require('gulp-uglify'),
    cleanCSS      = require('gulp-clean-css'),
    gulpIf        = require('gulp-if'),
    del           = require('del');


// ** Default task to start watching filechanges of .sass, .scss and .js **
// ** LiveReload browser **
gulp.task('watch', ['browserSync', 'sass'], function() {
      gulp.watch('assets/css/*.+(scss|sass)', ['sass']);
      gulp.watch('*.html', browserSync.reload);
      gulp.watch('assets/js/*.js', browserSync.reload);
      // Other watchers
    });

// ** Build task to build project **
gulp.task('build', function (callback) {
  runSequence('clean:build',
    ['sass', 'useref', 'fonts', 'vendorJS', 'vendorCSS', 'images'],
    callback
  )
});

// ** Development plugins **
gulp.task('sass', function() {
  return gulp.src('assets/css/*.+(scss|sass)')
    .pipe(plumber({
        handleError: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe(sass.sync()) // Using gulp-sass
    .pipe(plumber.stop())
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: ''
    },
  })
});

// ** Building plugins **
gulp.task('autoprefixer', function() {
  return gulp.src('./assets/css/*.css')
    .pipe(plumber({
        handleError: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe(postcss([autoprefixer({ browsers: ['last 2 versions'] }) ]))
    .pipe(plumber.stop())
    .pipe(gulp.dest('./build/assets/css'));
});

gulp.task('useref', function() {
  return gulp.src('*.html')
  .pipe(useref())
  .pipe(gulpIf('*.js', uglify())) // Minifies only if it's a JavaScript file. No vendor files.
  .pipe(gulpIf('*.css', cleanCSS())) // Minifies only if it's a CSS file. No vendor files.
  .pipe(gulp.dest('build'))
});

gulp.task('fonts', function() {       // Task copies possible fonts from dev to build
  return gulp.src('assets/fonts/**/*')
  .pipe(gulp.dest('build/assets/fonts'))
});

gulp.task('vendorJS', function() {       // Task copies possible vendor JS files from dev to build
  return gulp.src('assets/js/vendor/*.js')
  .pipe(gulp.dest('build/assets/js/vendor'))
});

gulp.task('vendorCSS', function() {       // Task copies possible vendor CSS files from dev to build
  return gulp.src('assets/css/vendor/*.css')
  .pipe(gulp.dest('build/assets/css/vendor'))
});

gulp.task('images', function() {       // Task copies possible image files from dev to build
  return gulp.src('assets/img/*.{gif,jpg,png,svg}')
  .pipe(gulp.dest('build/assets/img'))
});


gulp.task('clean:build', function() {
  return del(['build/**/*']);
});

// ** Error handling plugins **
gulp.src('./assets/*.ext')
    .pipe(plumber())
    .pipe(coffee())
    .pipe(gulp.dest('./build'));
