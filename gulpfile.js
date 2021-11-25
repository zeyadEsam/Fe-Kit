const gulp = require('gulp'),
    { src, series, parallel, dest, watch} = require('gulp'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass')(require('sass')),
    autoprefixer = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    sourcemaps = require('gulp-sourcemaps'),
    minify = require('gulp-minify'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify');

 function html() {
     return src('stage/*.html')
            .pipe(dest('dist'))
            .pipe(livereload())
 }

 exports.html = html;

 function css() {
     return src(["stage/css/**/*.css","stage/css/**/*.scss"])
            .pipe(sourcemaps.init())
            .pipe(sass({outputStyle: 'compressed'})).on('error', sass.logError)
            .pipe(autoprefixer())
            .pipe(concat('main.css'))
            .pipe(sourcemaps.write('.'))
            .pipe(dest('dist/css'))
            .pipe(livereload())
 }

 exports.css = css;

 function js() {
     return src("stage/js/*js")
            .pipe(concat('main.js'))
            .pipe(uglify())
            .pipe(minify())
            .pipe(dest('dist/js'))
            .pipe(livereload())
 };

exports.js = js;

function imgs() {
     return src('stage/images/*')
            .pipe(imagemin())
            .pipe(gulp.dest('dist/images'))
            .pipe(livereload())
};

exports.imgs = imgs;

function watchTask(){
    require('./server.js');
    livereload.listen();
    watch("stage/*.html",
      series(html, watchTask)
    );
    watch("stage/css/**/*.scss",
      series(css, watchTask)
    );
    watch("stage/js/*js",
      series(js, watchTask)
    );
  };

  exports.default = series(
    parallel(html, css, js, imgs),
    watchTask
  )