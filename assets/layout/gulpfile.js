// Определяем переменную "preprocessor"
let preprocessor = {
    engine: 'sass',
    files: 'scss'
};
let assetsDir = 'app/'

const svgSprite = require('gulp-svg-sprite'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace'),
    { src, dest, parallel, series, watch } = require('gulp'),
    browserSync = require('browser-sync').create(),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify-es').default,
    sass = require('gulp-sass')(require('sass')),
    cleancss = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    sourcemaps = require('gulp-sourcemaps');

// Определяем логику работы Browsersync
function browsersync() {
    browserSync.init({ // Инициализация Browsersync
        server: { baseDir: 'app/' }, // Указываем папку сервера
        notify: true, // Отключаем уведомления
        online: true // Режим работы: true или false
    })
}

function svgSpriteBuild() {
    return src(assetsDir + 'icons/*.svg')
        // minify svg
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        // remove all fill, style and stroke declarations in out shapes
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
                $('style').remove();
            },
            parserOptions: {xmlMode: true}
        }))
        // cheerio plugin create unnecessary string '&gt;', so replace it.
        .pipe(replace('&gt;', '>'))
        // build svg sprite
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "../../../sprite.svg",
                    render: {
                        scss: {
                            dest:'_sprite.scss',
                            template: assetsDir + "scss/templates/_sprite_template.scss"
                        }
                    }
                }
            }
        }))
        .pipe(dest(assetsDir + 'scss/icons/'));
}

exports.build_sprite = parallel(svgSpriteBuild);

function scripts_index() {
    return src([
        'app/libs/swiper/swiper-bundle.min.js',
        // 'app/js/app.js',
        // 'app/js/index/map/map.js',
        'app/js/index/!(*.min)*.js',
    ])
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('index.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js/index/'))
}
function styles_index() {
    return src('app/' + preprocessor.files + '/index.' + preprocessor.files + '')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(concat('index.min.css')) // Конкатенируем в файл app.min.js
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
        .pipe(cleancss( { level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ } ))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('app/css/index/'))
        .pipe(browserSync.stream())
}
function startwatch() {
    watch(['app/js/index/!(*.min)*.js'], scripts_index);
    watch('app/' + preprocessor.files + '/elements/index/*', styles_index);
}
exports.default = parallel(scripts_index, styles_index, startwatch);