const gulp = require('gulp');
const gru2 = require('gulp-rollup-2')
const ts = require('gulp-typescript')
const tsProject = ts.createProject('tsconfig.json')
const uglify = require('gulp-uglify')
const gulpHtmlI18n = require('@heho/gulp-html-i18n');
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
const { Transform } = require('stream');

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
        'baact/**/*',
        'locale/**/*',
    ] ,  gulp.series('provideLanguages', 'build.userscript', 'serve:reload') );
});

gulp.task('serve:reload' , function(cb) {
    browserSync.reload();
    cb();
});

gulp.task('transpile-ts', function () {
    return tsProject.src()
        .pipe(tsProject())
        .pipe(replace('@VERSION@', String(process.env.npm_package_version)))
        .pipe(replace('@AXE_MIN_URL@', String(process.env.AXE_MIN_URL)))
        .pipe(replace('@AXE_LOCALE_URL@', String(process.env.AXE_LOCALE_URL)))
        .pipe(replace('@PRIMARY@', String(process.env.THEME_PRIMARY) !== "" ? String(process.env.THEME_PRIMARY) : "#225147"))
        .pipe(replace('@PRIMARY_LIGHT@', String(process.env.THEME_PRIMARY_LIGHT) !== "" ? String(process.env.THEME_PRIMARY_LIGHT) : "#2c685b"))
        .pipe(replace('@PRIMARY_DARK@', String(process.env.THEME_PRIMARY_DARK) !== "" ? String(process.env.THEME_PRIMARY_DARK) : "#142e29"))
        .pipe(replace('@THEME_NEUTRAL@', String(process.env.THEME_NEUTRAL) !== "" ? String(process.env.THEME_NEUTRAL) : "#323130"))
        .pipe(replace('@THEME_NEUTRAL_LIGHT@', String(process.env.THEME_NEUTRAL_LIGHT) !== "" ? String(process.env.THEME_NEUTRAL_LIGHT) : "#656462"))
        .pipe(replace('@THEME_NEUTRAL_DARK@', String(process.env.THEME_NEUTRAL_DARK) !== "" ? String(process.env.THEME_NEUTRAL_DARK) : "#1F1E1D"))
        .pipe(gulp.dest('intermediate/transpiled'))
})

gulp.task('translate', function () {
    return gulp.src('./intermediate/bundled/**/*')
        .pipe(gulpHtmlI18n({
            langDir: './locale',
            createLangDirs: true,
            langRegExp: /i18n\((?:\"|\'|%27)([\w\-\.]+)(?:\"|\'|%27)\)/g
        }))
        .pipe(gulp.dest('./build'));
})

gulp.task('provideLanguages', function (cb) {
    const langs = fs.readdirSync('./locale', { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    const content = `export const langs = ${JSON.stringify(langs, null, 2)};\n`;
    fs.mkdirSync('./testing', { recursive: true });
    fs.writeFileSync('./testing/lang.js', content);

    cb();
});

gulp.task('rollup-userscript', function () {
    return gulp.src([
        './intermediate/transpiled/src/index.js',
    ])
        .pipe(gru2.rollup({
            input: './intermediate/transpiled/src/index.js',
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
        .pipe(gulp.dest('./intermediate/bundled/'));
});

gulp.task('rollup-bookmarklet', function () {
    return gulp.src([
        './intermediate/transpiled/src/index.js',
    ])
        .pipe(gru2.rollup({
            input: './intermediate/transpiled/src/index.js',
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
        .pipe(gulp.dest('./intermediate/bundled/'));
});

// Bundles and minifies without URL-encoding so translate can replace i18n tokens first.
gulp.task('rollup-bookmark-export-bundle', function () {
    return gulp.src([
        './intermediate/transpiled/src/index.js',
    ])
        .pipe(gru2.rollup({
            input: './intermediate/transpiled/src/index.js',
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
                    file: 'baat-bookmark.js',
                    name: 'baat',
                    format: 'iife',
                },
            ],
        }))
        .pipe(uglify({compress: { negate_iife: false }}))
        .pipe(gulp.dest('./intermediate/bundled/'));
});

// URL-encodes each per-language baat-bookmark.js produced by translate and wraps it in the HTML export template.
gulp.task('rollup-bookmark-export-package', function () {
    return gulp.src('./build/*/baat-bookmark.js')
        .pipe(URLEncoder())
        .pipe(header(fs.readFileSync('extras/bookmark-export-header.html', 'utf8').replace('{baat.version}', pkg.version), {version: pkg.version}))
        .pipe(footer(fs.readFileSync('extras/bookmark-export-footer.html', 'utf8').replace('{timestamp}', String(Math.round((new Date()).getTime()/1000))), {version: pkg.version}))
        .pipe(new Transform({
            objectMode: true,
            transform(file, enc, cb) {
                file.path = file.path.replace(/\.js$/, '.html');
                this.push(file);
                cb();
            }
        }))
        .pipe(gulp.dest('./build/'));
});

gulp.task('clean-bookmark-js', function (cb) {
    fs.readdirSync('./build', { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .forEach(dirent => {
            const filePath = path.join('./build', dirent.name, 'baat-bookmark.js');
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });
    cb();
});

gulp.task('build.bookmarklet', gulp.series('transpile-ts', 'rollup-bookmarklet', 'translate'));

gulp.task('build.userscript', gulp.series('transpile-ts', 'rollup-userscript', 'translate'));

gulp.task('build.bookmark-export', gulp.series('transpile-ts', 'rollup-bookmark-export-bundle', 'translate', 'rollup-bookmark-export-package', 'clean-bookmark-js'));

gulp.task('default', gulp.series(
    'transpile-ts',
    gulp.parallel('rollup-bookmarklet', 'rollup-userscript', 'rollup-bookmark-export-bundle'),
    'translate',
    'rollup-bookmark-export-package',
    'clean-bookmark-js'
));
