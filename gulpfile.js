const gulp = require('gulp');
const gru2 = require('gulp-rollup-2')
const ts = require('gulp-typescript')
const tsProject = ts.createProject('tsconfig.json')
const uglify = require('gulp-uglify')
const {nodeResolve} = require('@rollup/plugin-node-resolve')
const externalGlobals = require("rollup-plugin-external-globals")
const { default: minifyHTML } = require('rollup-plugin-minify-html-literals')
const header = require('gulp-header')
const footer = require('gulp-footer')
const pkg = require('./package.json')
const fs = require('fs')
const browserSync = require('browser-sync').create()
const sourcemaps = require('gulp-sourcemaps')
const path = require('path')
const replace = require('gulp-replace');
const dotenv = require('dotenv');
const URLEncoder = require("./gulp/UrlEncode");

dotenv.config();

gulp.task('serve', function( cb ){
    browserSync.init({
        open:  true ,
        server: {
            baseDir: "./"
        },
        startPath: 'testing'
    });

    gulp.watch([
        'src/**/*' ,
        'baact/**/*'
    ] ,  gulp.series('build.userscript', 'serve:reload') );
});

gulp.task('serve:reload' , function(cb) {
    browserSync.reload();
    cb();
});

gulp.task('transpile-ts', function () {
    return tsProject.src()
        .pipe(replace('@INFORMATION@', String(process.env.SETTINGS_INFORMATION) !== "" ? String(process.env.SETTINGS_INFORMATION) : "false"))
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write(".",{
            includeContent: false,
            sourceRoot: function (file) {
                return path.relative(path.dirname(file.path), file.base);
            },
            sourceMappingURL: function (file) {
                return `${file.relative}.map`;
            }
        }))
        .pipe(replace('@VERSION@', String(process.env.npm_package_version)))
        .pipe(replace('@AXE_MIN_URL@', String(process.env.AXE_MIN_URL)))
        .pipe(replace('@PRIMARY@', String(process.env.THEME_PRIMARY) !== "" ? String(process.env.THEME_PRIMARY) : "#d32228"))
        .pipe(replace('@PRIMARY_LIGHT@', String(process.env.THEME_PRIMARY_LIGHT) !== "" ? String(process.env.THEME_PRIMARY_LIGHT) : "#7e1317"))
        .pipe(replace('@PRIMARY_DARK@', String(process.env.THEME_PRIMARY_DARK) !== "" ? String(process.env.THEME_PRIMARY_DARK) : "#ed4047"))
        .pipe(replace('@THEME_NEUTRAL@', String(process.env.THEME_NEUTRAL) !== "" ? String(process.env.THEME_NEUTRAL) : "#323130"))
        .pipe(replace('@THEME_NEUTRAL_LIGHT@', String(process.env.THEME_NEUTRAL_LIGHT) !== "" ? String(process.env.THEME_NEUTRAL_LIGHT) : "#656462"))
        .pipe(replace('@THEME_NEUTRAL_DARK@', String(process.env.THEME_NEUTRAL_DARK) !== "" ? String(process.env.THEME_NEUTRAL_DARK) : "#1F1E1D"))
        .pipe(gulp.dest('intermediate'))
})

gulp.task('rollup-userscript', function () {
    return gulp.src([
        './intermediate/src/index.js',
    ])
        .pipe(gru2.rollup({
            input: './intermediate/src/index.js',
            plugins: [
                nodeResolve(),
                externalGlobals({
                    'axe-core': 'axe',
                }),
            ],
            external: [
                'axe-core',
            ],
            output: [
                {
                    file: 'userscript.js',
                    name: 'baat',
                    format: 'iife',
                },
            ],
        }))
        .pipe(header(fs.readFileSync('extras/userscript-header.js', 'utf8'), {version: pkg.version}))
        .pipe(gulp.dest('./build/'));
});
gulp.task('rollup-bookmarklet', function () {
    return gulp.src([
        './intermediate/src/index.js',
    ])
        .pipe(gru2.rollup({
            input: './intermediate/src/index.js',
            plugins: [
                nodeResolve(),
                minifyHTML(),
                externalGlobals({
                    'axe-core': 'axe',
                }),
            ],
            external: [
                'axe-core',
            ],
            output: [
                {
                    file: 'bookmarklet.txt',
                    name: 'baat',
                    format: 'iife',
                },
            ],
        }))
        .pipe(uglify({compress: { negate_iife: false }}))
        .pipe(header(fs.readFileSync('extras/bookmarklet-header.txt', 'utf8').replace('{baat.version}',pkg.version), {version: pkg.version}))
        .pipe(gulp.dest('./build/'));
});

gulp.task('rollup-bookmark-export', function () {
    return gulp.src([
        './intermediate/src/index.js',
    ])
        .pipe(gru2.rollup({
            input: './intermediate/src/index.js',
            plugins: [
                nodeResolve(),
                minifyHTML(),
                externalGlobals({
                    'axe-core': 'axe',
                }),
            ],
            external: [
                'axe-core',
            ],
            output: [
                {
                    file: 'baat-bookmark.html',
                    name: 'baat',
                    format: 'iife',
                },
            ],
        }))
        .pipe(uglify({compress: { negate_iife: false }}))
        .pipe(URLEncoder())
        .pipe(header(fs.readFileSync('extras/bookmark-export-header.html', 'utf8').replace('{baat.version}', pkg.version), {version: pkg.version}))
        .pipe(footer(fs.readFileSync('extras/bookmark-export-footer.html', 'utf8').replace('{timestamp}', String(Math.round((new Date()).getTime()/1000))), {version: pkg.version}))
        .pipe(gulp.dest('./build/'));
})
gulp.task('build.bookmarklet', gulp.series('transpile-ts', 'rollup-bookmarklet'));

gulp.task('build.userscript', gulp.series('transpile-ts', 'rollup-userscript'));

gulp.task('build.bookmark-export', gulp.series('transpile-ts', 'rollup-bookmark-export'));

gulp.task('default', gulp.series('transpile-ts', 'rollup-bookmarklet', 'rollup-userscript', 'rollup-bookmark-export'));