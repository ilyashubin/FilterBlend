gulp         = require 'gulp'

# code processing
postcss      = require 'gulp-postcss'
stylus       = require 'gulp-stylus'
jade         = require 'gulp-jade'

rupture      = require 'rupture'

# assets
usemin       = require 'gulp-usemin'
uglify       = require 'gulp-uglify'
browserify   = require 'gulp-browserify'

# utils
plumber      = require 'gulp-plumber'
watch        = require 'gulp-watch'
jadeGlobbing = require 'gulp-jade-globbing'
colors       = require 'colors'
notify       = require 'gulp-notify'
runSequence  = require 'run-sequence'
browserSync  = require('browser-sync').create()


processors = [
  require('autoprefixer')
    browsers: ['> 1%', 'last 5 versions']
]


# --- MARKUP ---

# Jade compilation

gulp.task 'jade', ->
  gulp.src ['src/views/*.jade', '!src/views/_*.jade']
    .pipe plumber
      errorHandler: notify.onError
        message: '<%= error.message %>',
        title: 'Jade'
    .pipe jadeGlobbing()
    .pipe jade
      pretty: true
    .pipe gulp.dest 'dist'


# --- STYLES ---

# Styus compilation


gulp.task 'styles', ->

  gulp.src 'src/styles/main.styl'
    .pipe plumber
      errorHandler: notify.onError
        message: '<%= error.message %>',
        title: 'Styles'
    .pipe stylus
      use: [rupture()]
    .pipe postcss processors
    .pipe gulp.dest 'dist/css'
    .pipe browserSync.reload
      stream: true


# --- SCRIPTS ---

# Browserify with Bebel transpiling

gulp.task 'scripts', ->
  gulp.src 'src/js/app.js', { read: false }
    .pipe plumber
      errorHandler: notify.onError
        message: '<%= error.message %>',
        title: 'JS'
    .pipe browserify
      paths: ['./node_modules', './src/js']
      transform: ['babelify']
      insertGlobals: true
      # debug: true
    .pipe gulp.dest 'dist/js'

# Compress js

gulp.task 'compress', ->
  gulp.src 'dist/js/app.concat.js'
    .pipe uglify
      preserveComments: 'license'
    .pipe gulp.dest 'dist/js'

# Assets concat

gulp.task 'usemin', ->
  gulp.src 'dist/*.html'
    .pipe usemin
      js: []
      css: []
    .pipe gulp.dest 'dist'


# --- MISC ---

gulp.task 'serve', ->
  browserSync.init
    port: 8000
    open: false
    notify: false
    reloadOnRestart: true
    ghostMode: false
    server:
      baseDir: './dist'


# Default task

gulp.task 'default', ->
  runSequence 'serve', 'scripts', 'jade', 'styles'

  watch ['src/styles/**/*.styl'], -> runSequence 'styles'
  watch ['src/views/*.jade', 'src/partials/*.jade'], -> runSequence 'jade'
  watch ['src/js/**/*.js'], -> runSequence 'scripts'
  watch ['dist/*.html', 'dist/js/**/*.js'], browserSync.reload
