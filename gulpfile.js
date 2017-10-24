var gulp = require('gulp'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	prefix = require('gulp-autoprefixer'),
	gutil = require('gulp-util'),
	gulpif = require('gulp-if'),
	minify = require('gulp-minify'),
	concat = require('gulp-concat'),
    notify = require('gulp-notify'),
	browsersync = require('browser-sync'),
	fileinclude = require('gulp-file-include'),
	cssnano = require('gulp-cssnano');

var env,
	jsSources,
	sassSources,
	htmlSources,
	outputDir;

env = process.env.NODE_ENV || 'development';
if (env === 'development') {
	outputDir = 'builds/development/';
} else {
	outputDir = 'builds/production/';
}

jsSources = ['components/scripts/customScript.js'];
// jsSources_rtl = [ 'components/scripts/customScript.js'];
sassSources = ['components/sass/app.scss'];
// sassSources_rtl = ['components/sass_rtl/app_rtl.scss'];
htmlSources = [outputDir + '*.html'];

//BrowserSync Function
gulp.task('browser-sync', function() {
    browsersync({
        // Fill This with proxy domain for dynamic (WAMP) server
        // proxy: 'http://shaarawy-init',
        // port: 3000

        // Change the director name for static site
		server: {
            baseDir: "./builds/development"
        }
    });
});

// Swallow Error Function to prevent error from breaking the task running
function swallowError (error) {
  // If you want details of the error in the console
  console.log(error.toString())
  this.emit('end')
}

// Browser Sync reload function
gulp.task('browsersync-reload', function () {
    browsersync.reload();
});

// SASS function
gulp.task('sass', function () {
	gulp.src(sassSources)
		.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: ['components/sass/**/*']
		}).on('error', sass.logError))
		.pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('builds/development/css'))
		.pipe(browsersync.reload({ stream:true }))
		.pipe(notify({ message: 'SASS task complete' }));
});

// Minify CSS using "CSSNano" package
gulp.task('minifyCSS', function () {
  return gulp.src('builds/development/css/app.css')
    .pipe(cssnano())
    .pipe(gulp.dest('builds/production/css'))
    .pipe(notify({ message: 'MINIFY CSS COMPLETE' }));
});

// SASS RTL function
// gulp.task('sass_rtl', function () {
// 	gulp.src(sassSources_rtl)
// 		.pipe(sourcemaps.init())
// 		.pipe(sass({
// 			includePaths: ['components/sass_rtl/**/*']
// 		}).on('error', sass.logError))
// 		.pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
// 		.pipe(sourcemaps.write())
// 		.pipe(gulp.dest('builds/development/css'))
// 		.pipe(browsersync.reload({ stream:true }))
// 		.pipe(notify({ message: 'SASS task complete' }));
// });

// Minify CSS RTL using "CSSNano" package
// gulp.task('minifyCSSRTL', function () {
//   return gulp.src('builds/development/css/app_rtl.css')
//     .pipe(cssnano())
//     .pipe(gulp.dest('builds/production/css'))
//     .pipe(notify({ message: 'MINIFY CSS RTL COMPLETE' }));
// });

// js function
gulp.task('js', function() {
	gulp.src(jsSources)
		.pipe(concat('script.js'))
		.on('error', gutil.log)
		.pipe(gulpif(env === 'production', minify({
			ext: {
				min:".js"
			},
			noSource: true
		})))
		.pipe(gulp.dest(outputDir + 'js'))
		.pipe(browsersync.reload({ stream:true }))
		.pipe(notify({ message: 'JS task complete' }));
});

// js rtl function
// gulp.task('js_rtl', function() {
// 	gulp.src(jsSources_rtl)
// 		.pipe(concat('script_rtl.js'))
// 		.on('error', gutil.log)
// 		.pipe(gulpif(env === 'production', minify({
// 			ext: {
// 				min:".js"
// 			},
// 			noSource: true
// 		})))
// 		.pipe(gulp.dest(outputDir + 'js'))
// 		.pipe(browsersync.reload({ stream:true }))
// 		.pipe(notify({ message: 'JS RTL task complete' }));
// });

// html function
gulp.task('html', function() {
    gulp.src(['html_pages/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file',
            indent: true
        }))
        .on('error', swallowError)
        .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
        .pipe(gulp.dest(outputDir))
		// .pipe(browsersync.reload({ stream:true }))
		.pipe(notify({ message: 'HTML task complete' }));
});

// php function
gulp.task('php', function() {
	gulp.src('builds/development/*.php')
		.pipe(gulpif(env === 'production', gulp.dest(outputDir)));
});

// Copy images to production
gulp.task('move', function() {
	gulp.src('builds/development/images/**/*.*')
		.pipe(gulpif(env === 'production', gulp.dest(outputDir + 'images')));
});

// Copy videos to production
gulp.task('moveVideos', function () {
    gulp.src('builds/development/videos/**/*.*')
        .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'videos')));
});

// BrowserSync Function and Watch Function
gulp.task('server', ['browser-sync'], function() {

    gulp.watch("components/sass/**/*.scss", ['sass']);
    // gulp.watch("components/sass_rtl/**/*.scss", ['sass_rtl']);
    gulp.watch("html_pages/**/*.html", ['html']);
    gulp.watch("builds/development/*.html", ['browsersync-reload']);
    gulp.watch("builds/development/*.php", ['browsersync-reload']);
    gulp.watch("components/scripts/**/*.js", ['js']);
});

gulp.task('default', ['server', 'html', 'php', 'js', 'sass', 'minifyCSS', 'move', 'moveVideos']);
