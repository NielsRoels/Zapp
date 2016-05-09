var gulp = require('gulp');
var minifyCss = require('gulp-minify-css');
var nodemon = require('gulp-nodemon');
var sass = require('gulp-sass');

gulp.task('sass', function(){
	return gulp.src('public/stylesheets/scss/style.scss')
		.pipe(sass())
		.pipe(gulp.dest('public/stylesheets/css'))
});

gulp.task('css', function(){
	return gulp.src('public/stylesheets/css/style.css')
		.pipe(minifyCss({comptability: 'ie8'}))
		.pipe(gulp.dest('public/stylesheets/css'));
});

gulp.task('nodemon', function() {
	return nodemon({
		script: 'bin/www',
		ext: 'js'
	}).on('start', function(){
	});
});

gulp.task('watch', function(){
	gulp.watch('public/stylesheets/scss/*.scss', ['sass']);
	gulp.watch('public/stylesheets/css/*.css', ['css']);
});

gulp.task('default', ['watch', 'sass', 'css', 'nodemon']);