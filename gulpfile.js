(function() {
  var $, gulp;

  gulp = require('gulp');

  $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
  });

  gulp.task('sass', function() {
    return gulp.src('src/sass/style*.sass').pipe($.plumber({
      errorHandler: function(error) {
        console.log(error.message);
        return this.emit('end');
      }
    })).pipe($.compass({
      config_file: './sass-config.rb',
      comments: false,
      css: 'dist/assets/css/',
      sass: 'src/sass/',
      image: 'dist/assets/image'
    })).pipe(gulp.dest('dist/assets/css/')).pipe($.connect.reload());
  });

  gulp.task('slim', function() {
    return gulp.src('src/slim/*.slim').pipe($.cached('slim')).pipe($.plumber({
      errorHandler: function(error) {
        console.log(error.message);
        return this.emit('end');
      }
    }))
    .pipe($.shell(['slimrb -r slim/include -p <%= file.path %> > ./dist/<%= file.relative.replace(".slim", ".html") %>']))
    .pipe($.connect.reload());
  });

  gulp.task('server', function() {
    return $.connect.server({
      root: ['dist/'],
      port: 8000,
      livereload: true
    });
  });

  gulp.task('watch', function() {
    gulp.watch('src/sass/*.sass', ['sass']);
    gulp.watch('src/sass/**/*.sass', ['sass']);
    gulp.watch('src/slim/*.slim', ['slim']);
    return gulp.watch('src/slim/**/*.slim', ['slim']);
  });

  gulp.task('default', ['server', 'watch']);

}).call(this);
