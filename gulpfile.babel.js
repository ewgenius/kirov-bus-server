import gulp from 'gulp'
import shell from 'gulp-shell'
import babel from 'gulp-babel'

gulp.task('compile', () => {
  gulp.src('src/**/*.js')
    .pipe(babel({
      presets: ['es2015', 'stage-0']
    }))
    .pipe(gulp.dest('build'))
})

gulp.task('watch', ['compile'], () => {
  gulp.watch('src/**/*.js', ['compile'])
})

gulp.task('run', shell.task('nodemon'))

gulp.task('default', ['watch', 'run'])
