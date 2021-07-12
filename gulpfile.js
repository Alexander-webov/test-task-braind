let gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  del = require('del'),
  autoprefixer = require('gulp-autoprefixer');

//удаляем полностью физически папку  dist
gulp.task('clean', async function () {
  del.sync('dist')
})
//из scss в css
gulp.task('scss', function () {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
      browsers: ['last 8 versions']
    }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});
//добавляем сторонние css библиотеки
gulp.task('css', function () {
  return gulp.src([
      'node_modules/normalize.css/normalize.css',
      'node_modules/slick-carousel/slick/slick.css',
    ])
    .pipe(concat('_libs.scss'))
    .pipe(gulp.dest('app/scss'))
    .pipe(browserSync.reload({
      stream: true
    }))
});
// html таск, в который мы присоединили к браузеру синк
gulp.task('html', function () {
  return gulp.src('app/*.html')
    .pipe(browserSync.reload({
      stream: true
    }))
});
// js таск, в который мы присоединили к браузеру синк
gulp.task('script', function () {
  return gulp.src('app/js/*.js')
    .pipe(browserSync.reload({
      stream: true
    }))
});

//добавляем сторонние js библиотеки
gulp.task('js', function () {
  return gulp.src([
      'node_modules/slick-carousel/slick/slick.js'
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({
      stream: true
    }))
});
//автообновление браузера
gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: "app/"
    }
  });
});

//переносим все наши файлы из папки app в dist (папку dist gulp сам создает)
gulp.task('export', function () {
  let buildHtml = gulp.src('app/**/*.html')
    .pipe(gulp.dest('dist'));

  let BuildCss = gulp.src('app/css/**/*.css')
    .pipe(gulp.dest('dist/css'));

  let BuildJs = gulp.src('app/js/**/*.js')
    .pipe(gulp.dest('dist/js'));

  let BuildFonts = gulp.src('app/fonts/**/*.*')
    .pipe(gulp.dest('dist/fonts'));

  let BuildImg = gulp.src('app/img/**/*.*')
    .pipe(gulp.dest('dist/img'));
});

// обновление при любом изминение
gulp.task('watch', function () {
  gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'));
  gulp.watch('app/*.html', gulp.parallel('html'))
  gulp.watch('app/js/*.js', gulp.parallel('script'))
});

//сначало удаляет папку dist которую мы выше создаем, а потом создаем ее с новыми файлами и новыми изминениями
gulp.task('build', gulp.series('clean', 'export'));

//что должно выполнятся в консоле по умолчанию
//запускаем одновременно два таска в консоле watch и browser-sync
gulp.task('default', gulp.parallel('css', 'scss', 'js', 'browser-sync', 'watch'));