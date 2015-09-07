var gulp = require('gulp'),
	gutil = require('gulp-util'),
	uglify = require('gulp-uglify'),
	header = require('gulp-header'),
	filter = require('gulp-filter'),
	concat = require('gulp-concat'),
	browserSync = require('browser-sync'),
	sass = require('gulp-sass'),
	bodyParser = require('body-parser'),
	express = require('express'),
	livereload = require('gulp-livereload'),
	notify = require("gulp-notify"),
	lr = require('tiny-lr'),
	server = lr(),
	bourbon = require('node-bourbon').includePaths,
	neat = require('node-neat').includePaths;

var jsSrc = [
		'src/js/*.js'
	],
	sassSrc = [
		'src/styles/sass/*.scss'
	];

// Static server
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: "./"
		}
	});
});


gulp.task('js', function () {
	gulp.src(jsSrc)
		.pipe(uglify())
		.pipe(concat('output.min.js'))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('sass', function () {
	gulp.src(sassSrc)
		.pipe(sass({
			style: 'expanded',
			errLogToConsole:false,
			onError: function(err) {
				return notify().write(err);
			},
			lineNumbers: true,
			sourcemap: false,
			includePaths: [bourbon].concat(neat)
		}))
		.pipe(concat('style.css'))
		.pipe(gulp.dest('dist/css'))
		.pipe(livereload());
		//.pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('copy', function () {
	gulp.src('./src/assets/**/*')
		.pipe(gulp.dest('dist/assets'));
});

gulp.task('server', function () {
	app = express();
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(express.static(__dirname));
	app.listen(4000);
});

// Watches
gulp.task('watch', function () {
	var server = livereload();
	gulp.watch(jsSrc, ['js']);
	gulp.watch(sassSrc, ['sass']);
	gulp.watch(['dist/js/*.js', 'dist/css/*.css', '*.html'], function (e) {
		server.changed(e.path);
	});
});

gulp.task('default', [
	'server',
	'copy',
	'sass',
	'js',
	'watch'
]);

gulp.task('mamp', [
	'copy',
	'sass',
	'js',
	'watch'
]);
