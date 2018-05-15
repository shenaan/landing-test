const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require('gulp-rename');



/*----------server------------*/

gulp.task('server', function () {
    browserSync.init({
        injectChanges: true,
        server: {
            port: 9000,
            baseDir: "build"
        }
    });

    gulp.watch('build/**/*').on('change', browserSync.reload);
});

/*----------pug compiler------------*/

gulp.task('templates:compile', function buildHTML() {
    return gulp.src('source/templates/index.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'));
});

/*----------------sass---------------*/
gulp.task('styles:compile', function () {
    return gulp.src('source/styles/main.scss')
      .pipe(sass({outputStyle:'compressed'})
      .on('error', sass.logError))
      .pipe(rename('main.min.css'))
      .pipe(gulp.dest('build/css'));
});

/*----------sprites--------------------*/
gulp.task('sprite', function (cb) {
    const spriteData = gulp.src('images/*.png').pipe(spritesmith({
      imgName: 'sprite.png',
      imgPath: '../images/sprite.png',
      cssName: 'sprite.scss'
    }));

    spriteData.img.pipe(gulp.dest('build/images'));
    spriteData.css.pipe(gulp.dest('source/styles/global/'));
    cb();
});

/* ------------ Delete ------------- */
gulp.task('clean', function del(cb) {
    return rimraf('build', cb);
  });  

/*-------------------copy fonts-------------------- */
gulp.task('copy:fonts',function(){
    return gulp.src('./source/fonts/**/*.*')
    .pipe(gulp.dest('build/fonts'));
});
   
/*-------------------copy images-------------------- */
gulp.task('copy:images',function(){
    return gulp.src('./source/images/**/*.*')
    .pipe(gulp.dest('build/images'));
});

/*-----------------copy----------------- */
gulp.task('copy',gulp.parallel('copy:fonts','copy:images'));

/*---------delete------- */
gulp.task('clean',function del(cb){
 return rimraf('build', cb);
});

/*-------------watchers--------------- */
gulp.task('watch',function(){
    gulp.watch('source/templates/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'))
});

/*----------default------------- */
gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('styles:compile', 'templates:compile','sprite', 'copy'),
    gulp.parallel('watch','server')
    )
);