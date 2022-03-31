const gulp = require('gulp'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    purgecss = require('gulp-purgecss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    del = require('del'),
    eslint = require('gulp-eslint'),
    plumber = require('gulp-plumber'),
    webpack = require('webpack'),
    webpackstream = require('webpack-stream'),
    webpackconfig = require('./webpack.config.js'),
    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp'),
    newer = require('gulp-newer'),
    htmlmin = require('gulp-htmlmin'),
    gulpIf = require('gulp-if'),
    fileRev = require('gulp-file-rev'),
    babel = require('gulp-babel');

const paths = {
    styles: {
        src: 'src/sass/style.scss',
        dest: 'dist/css'
    },
    js: {
        src: 'src/js/**/*.js',
        dest: 'dist/js'
    },
    img: {
        src: 'src/img/**/*',
        dest: 'dist/img'
    },
    fonts: {
        src: 'src/fonts/**/*',
        dest: 'dist/fonts'
    },
    video: {
        src: 'src/video/**/*',
        dest: 'dist/video'
    }
};
//SASS
function css() {
    return (
        gulp
            .src(paths.styles.src)
            .pipe(sourcemaps.init())
            .pipe(sass())
            .on('error', sass.logError)
            // Use postcss with autoprefixer and compress the compiled file using cssnano
            .pipe(postcss([autoprefixer(), cssnano()]))
            // Now add/write the sourcemaps
            .pipe(sourcemaps.write())
            // .pipe(purgecss({
            //     content: ['src/**/*.html'],
            //     // Inserir whitelist para css que é inserido via js
            //     // whitelistPatterns: [/slick/, /open/],
            //     // whitelistPatternsChildren: [/slick/]
            // }))
            .pipe(gulp.dest(paths.styles.dest))
        // .pipe(browserSync.stream())
    );
}
function cssOptimize() {
    return (
        gulp
            .src(paths.styles.src)
            // .pipe(sourcemaps.init())
            .pipe(sass())
            .on('error', sass.logError)
            // Use postcss with autoprefixer and compress the compiled file using cssnano
            .pipe(postcss([autoprefixer(), cssnano()]))
            // Now add/write the sourcemaps
            // .pipe(purgecss({
            //     content: ['src/**/*.html'],
            //     // Inserir whitelist para css que é inserido via js
            //     // whitelistPatterns: [/slick/, /open/],
            //     // whitelistPatternsChildren: [/slick/]
            // }))
            .pipe(gulp.dest(paths.styles.dest))
        // .pipe(browserSync.stream())
    );
}
function initBrowserSync(done) {
    browserSync.init({
        server: {
            baseDir: './dist/'
        },
        files: ['./dist/css/main.min.css', './dist/js/main.bundle.js', './dist/**/*.{html, xml}'],
        port: 3000,
        open: true
    });
    done();
}

// Lint scripts
function scriptsLint() {
    return gulp
        .src([paths.js.src, './gulpfile.js'])
        .pipe(plumber())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

function reloadBrowserSync(done) {
    browserSync.reload();
    done();
}

// Remover a pasta build
/*
 */
function clean() {
    return del(['./dist']);
}

function scripts() {
    return (
        gulp
            .src([paths.js.src])
            .pipe(
                babel({
                    presets: ['@babel/env']
                })
            )
            .pipe(plumber())
            .pipe(webpackstream(webpackconfig, webpack))
            // folder only, filename is specified in webpack config
            .pipe(gulp.dest(paths.js.dest))
            .pipe(browserSync.stream())
    );
}

function imagesOptimized() {
    return gulp
        .src(paths.img.src)
        .pipe(newer(paths.img.dest))
        .pipe(
            imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.jpegtran({ progressive: true }),
                imagemin.optipng({ optimizationLevel: 3 })
            ])
        )
        .pipe(gulp.dest(paths.img.dest))
        .pipe(webp())
        .pipe(gulp.dest(paths.img.dest));
}

// Optimize Images
function images() {
    return gulp
        .src(paths.img.src)
        .pipe(newer(paths.img.dest))
        .pipe(gulp.dest(paths.img.dest));
}

function watchFiles() {
    gulp.watch(paths.styles.src, gulp.series(css, reloadBrowserSync));
    gulp.watch(paths.js.src, gulp.series(scriptsLint, scripts));
    gulp.watch(paths.img.src, images);
    gulp.watch('src/**/*.html', gulp.series(html, reloadBrowserSync));
}

function html() {
    return gulp
        .src('src/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
}

function filerev() {
    var revision = fileRev();

    return (
        gulp
            .src('dist/**/*')
            // revise files
            .pipe(gulpIf('**/*.{jpg,png,gif,css,js}', revision))
            // replace references
            .pipe(gulpIf('**/*.{html,css,js}', revision.replace))
            .pipe(gulp.dest('dist'))
    );
}

function fonts() {
    return gulp.src('src/fonts/**/*').pipe(gulp.dest('dist/fonts'));
}

function video() {
    return gulp.src('src/video/**/*').pipe(gulp.dest('dist/video'));
}

//compressao das imagens
const js = gulp.series(scriptsLint, scripts);
const build = gulp.series(clean, gulp.parallel(cssOptimize, js, imagesOptimized, html, fonts, video));
const watch = gulp.series(
    clean,
    gulp.parallel(css, js, imagesOptimized, html, fonts, video),
    gulp.parallel(watchFiles, initBrowserSync)
);
exports.build = build;
exports.babel = js;
exports.watch = watch;
exports.rev = filerev;
//, gulp.parallel(css, images, jekyll, js)
