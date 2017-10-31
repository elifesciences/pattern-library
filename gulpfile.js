
"use strict";

/*************************************
 *  Packages
 *************************************/

const autoprefixer      = require('gulp-autoprefixer');
const babel             = require('babelify');
const browserify        = require('browserify');
const browserSync       = require('browser-sync');
const buffer            = require('vinyl-buffer');
const compass           = require('gulp-compass');
const concat            = require('gulp-concat');
const del               = require('del');
const es                = require('event-stream');
const express           = require('express');
const glob              = require('glob');
const gulp              = require('gulp');
const gutil             = require('gulp-util');
const imagemin          = require('gulp-imagemin');
const jscs              = require('gulp-jscs');
const jshint            = require('gulp-jshint');
const minimist          = require('minimist');
const mochaPhantomjs    = require('gulp-mocha-phantomjs');
const postcss           = require('gulp-postcss');
const rename            = require('gulp-rename');
const reporter          = require('postcss-reporter');
const sass              = require('gulp-sass');
const sassGlob          = require('gulp-sass-glob');
const source            = require('vinyl-source-stream');
const sourcemaps        = require('gulp-sourcemaps');
const stylelint         = require('stylelint');
const syntax_scss       = require('postcss-scss');
const uglify            = require('gulp-uglify');
const webdriver         = require('gulp-webdriver');


const js3rdPartySource = './assets/js/libs/third-party/**/*.js';
const jsPolyfills = './assets/js/libs/polyfills.js';
const jsSource = ['./assets/js/**/*.js', '!' + js3rdPartySource, '!' + jsPolyfills];
const jsDest = './source/assets/js';

let options = minimist(process.argv);
let environment = options.environment || 'development';
let mocha_grep = options['mocha-grep'] || null;

let server;

/*************************************
 *  Tasks
 *************************************/

gulp.task('generateStyles', ['generateAllStyles', 'generateIndividualStyles'], () => {
  del(['source/assets/css/tmp']);
});

gulp.task('generateIndividualStyles', ['buildStyleFiles'], () => {
  return gulp.src(['source/assets/css/tmp/**/*.css', 'source/assets/css/tmp/**/*.map'])
      .pipe(rename({ dirname: '' }))
      .pipe(gulp.dest('source/assets/css'));

});

gulp.task('buildStyleFiles', ['sass:lint'], () => {

  return gulp.src(['assets/sass/base.scss', 'assets/sass/patterns/**/*.scss'])
    .pipe(compass(
      {
        config_file: 'config.rb',
        css: 'source/assets/css/tmp',
        sass: 'assets/sass',
        sourcemap: true,
        style: environment === 'production' ? 'compressed' : 'expanded'
      }
    ))
    .pipe(gulp.dest('source/assets/css/tmp'));

  }
);


 /******************************************************************************
  * CSS pre-processing task
  *
  * Lints SASS files.
  * 'Globs' SASS pattern files so that each each individual file does need manually adding to the main build file.
  * Builds CSS from Sass source files.
  * Creates sourcemap.
  * Auto-prefixes properties as required.
  ******************************************************************************/

gulp.task('generateAllStyles', ['sass:lint'], () => {

  let options = environment === 'production' ? {outputStyle: 'compressed'} : null;

  return gulp.src('assets/sass/build.scss')
      .pipe(sourcemaps.init())
      .pipe(sassGlob())
      .pipe(sass(options).on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['ie >= 9', 'Firefox ESR', 'Opera 12.1', 'last 3 Safari versions']
      }))
      .pipe(rename('all.css'))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('source/assets/css'));
});

gulp.task('sass:lint', ['sass:clean'], () => {

  let processors = [
    stylelint(),
    reporter({
      clearMessages: true,
      throwError: true
    })
  ];

  return gulp.src(
            [
              'assets/sass/**/*.scss',
              // Ignore linting vendor assets
              // Useful if you have bower components, etc...
              '!assets/sass/vendor/**/*.scss'
          ]
      )
      .pipe(postcss(processors, {syntax: syntax_scss}));
});

gulp.task('sass:clean', () => {
  del(['./source/assets/css/*']);
});

gulp.task('img:clean', () => {
  del(['./source/assets/img']);
});

/******************************************************************************
 * Image optimisation/copy task
 * Optimises images for production and copies them into the public assets dir.
 ******************************************************************************/
// Regenerating images is time-consuming. Only call img:clean as a dependency when necessary
gulp.task('img', () => {
  return gulp.src('./assets/img/**/*')
      .pipe(imagemin({
        progressive: true,
        svgoPlugins: [
          { removeViewBox: false },
          { removeUselessStrokeAndFill: false }
        ],
      }))
      .pipe(gulp.dest('./source/assets/img'));
});

/******************************************************************************
 * Font handling task
 * Currently just copies over specified font files (and custom css files) into the public directory
 ******************************************************************************/

gulp.task('fonts', () => {
  del(['./source/assets/fonts/*']);

  return gulp.src('./assets/fonts/**/*')

    // output to dest folder
    .pipe(gulp.dest('./source/assets/fonts'));
});


/******************************************************************************
 * JavaScript build task
 *
 * Lints JS files.
 * Transpiles ES6 code to ES5 code.
 * Runs Browserify to to collect up the modules into a single file.
 * (Optional) Minifies the code.
 * Creates a sourcemap.
 ******************************************************************************/

gulp.task('js', ['js:hint', 'js:cs', 'browserify-tests'], () => {

    return browserify('./assets/js/main.js', { debug: true })
          .transform(babel)
          .bundle()
          .on('error', (err) => {
            console.error(err.message);
          })
          .pipe(source('main.js'))
          .pipe(buffer())
          .pipe(sourcemaps.init({loadMaps: true}))
          .pipe(environment === 'production' ? uglify() : gutil.noop())
          .pipe(sourcemaps.write('./'))
          .pipe(gulp.dest(jsDest))
          .pipe(reload());
});

gulp.task('js:clean', () => {
  del([jsDest + '/*']);
});

gulp.task('js:hint', () => {
  return gulp.src(jsSource)
     .pipe(jshint())
     .pipe(jshint.reporter('default'))
     .pipe(jshint.reporter('fail'));
});

gulp.task('js:cs', () => {
  return gulp.src(jsSource)
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
});

gulp.task('browserify-tests', (done) => {

  del(['./test/build/*']);

  glob('./test/*.spec.js', (err, files) => {

    let tasks = files.map(entry => {
      return browserify({ entries: [entry] })
      .transform(babel)
      .bundle()
      .pipe(source(entry))
      .pipe(rename({ dirname: '' }))
      .pipe(gulp.dest('./test/build'))
      .pipe(reload());
    });

    es.merge(tasks).on('end', done);
  });
});


gulp.task('test', ['browserify-tests', 'js'], () => {
  return gulp.src('./test/*.html')
    .pipe(mochaPhantomjs({
      reporter: 'spec',
      mocha: {
        grep: mocha_grep
      },
      'ignore-resource-errors': true
    }))
    .pipe(reload());
});

gulp.task('test:selenium', function() {
    return gulp.src('wdio.conf.js').pipe(webdriver());
});

gulp.task('test:selenium:local', function() {
    return gulp.src('wdio-local.conf.js').pipe(webdriver());
});

// Watchers

gulp.task('sass:watch', () => {
  gulp.watch('assets/sass/**/*', ['generateStyles']);
});

gulp.task('img:watch', () => {
  gulp.watch('assets/img/**/*', ['img']);
});

gulp.task('fonts:watch', () => {
  gulp.watch('assets/fonts/**/*', ['fonts']);
});

gulp.task('js:watch', () => {
  gulp.watch(['assets/js/**/*', './test/*.spec.js'], ['js']);
});

// Task sets
gulp.task('watch', ['sass:watch', 'img:watch', 'js:watch', 'fonts:watch'/*, 'tests:watch'*/]);
gulp.task('default', ['generateStyles', 'img', 'fonts', 'js']);

/******************************************************************************
 * Used for local testing
 *  Update startPath in `server` task to the test file to be checked.
 ******************************************************************************/
gulp.task('tests:watch', ['server', 'js:watch', 'browserify-tests'], () => {
  gulp.watch('test/*.spec.js', ['browserify-tests']);
});

gulp.task('server', () => {
  if (!server) {
    server = express();
    server.use(express.static('./'));
    server.listen('8080');
    browserSync({proxy: 'localhost:8080', startPath: 'test/utils.html', browser: 'google chrome'});
  } else {
    return gutil.noop;
  }
});

function reload() {
  if (server) {
    return browserSync.reload({stream: true});
  } else {
    return gutil.noop();
  }
}
