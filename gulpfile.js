(function() {
  var $, gulp;

  gulp = require('gulp');

  $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
  });

  gulp.task('sass', function() {
    return gulp.src('assets/sass/style.sass').pipe($.plumber({
      errorHandler: function(error) {
        console.log(error.message);
        return this.emit('end');
      }
    })).pipe($.compass({
      config_file: './sass-config.rb',
      comments: false,
      css: 'assets/css/',
      sass: 'assets/sass/',
      image: 'assets/image'
    })).pipe(gulp.dest('assets/css/')).pipe($.connect.reload());
  });

  gulp.task('slim', function() {
    return gulp.src('assets/slim/*.slim').pipe($.cached('slim')).pipe($.plumber({
      errorHandler: function(error) {
        console.log(error.message);
        return this.emit('end');
      }
    })).pipe($.shell(['slimrb -r slim/include -p <%= file.path %> > ./<%= file.relative.replace(".slim", ".html") %>'])).pipe($.connect.reload());
  });

  gulp.task('server', function() {
    return $.connect.server({
      root: ['./'],
      port: 8000,
      livereload: true
    });
  });

  gulp.task('watch', function() {
    gulp.watch('assets/sass/*.sass', ['sass']);
    gulp.watch('assets/sass/**/*.sass', ['sass']);
    gulp.watch('assets/slim/*.slim', ['slim']);
    return gulp.watch('assets/slim/**/*.slim', ['slim']);
  });

  gulp.task('default', ['server', 'watch']);

}).call(this);
