var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglifyjs'),
    //for css libraries files concat and rename
    cssnano     = require('gulp-cssnano'),
    rename      = require('gulp-rename'),
    del         = require('del'),
    imgMin      = require('gulp-imagemin'),
    pngQuant    = require('imagemin-pngquant'),
    cache       = require('gulp-cache'),
    autoprefixer= require('gulp-autoprefixer'),
    compass     = require('gulp-compass'),
    svgSprite   = require('gulp-svg-sprite'),
    svgmin      = require('gulp-svgmin'),
    cheerio     = require('gulp-cheerio'),
    replace     = require('gulp-replace'); //add libraries

console.log(uglify);
//compile and sync scss files
gulp.task('sass', function() {
    return gulp.src('app/sass/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer(['last 5 versions', '>1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.reload({
            stream: true
        }));
});

//concat libs js files and minify
// gulp.task('scripts', function() {
//     return gulp.src([
//         'app/libs/jquery/dist/jquery.min.js',
//         'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js'
//         ])
//         .pipe(concat('libs.min.js')) //concat all libs into one (in this case libs.min.js)
//         .pipe(uglify()) //minufication plugin
//         .pipe(gulp.dest('app/js')); //destination of concated files
// });

//min css libs and rename (add .min)
gulp.task('css-libs', ['sass'], function() {
    return gulp.src('app/css/libs.css')
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'));
});

//sync all you browsers and
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false //delete notification
    })
});

//delete dist folder, and create it again after compiling
gulp.task('clean', function() {
    return del.sync('dist')
});

// remove cache for img optimization
gulp.task('clearCach', function() {
    return cache.clearAll();
});

//img optimization
gulp.task('imgOptimization', function() {
    return gulp.src('app/img/**/*')
        .pipe(cache(imgMin({ //imgMin - function above, cache also from above
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngQuant()] //pngQuant - function above

        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('svgSpriteBuild', function () {
    return gulp.src('app/img/icons/*.svg')
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
            },
            parserOptions: {xmlMode: true}
        }))
        // cheerio plugin create unnecessary string '&gt;', so replace it.
        .pipe(replace('&gt;', '>'))
        // build svg sprite
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "../sprite.svg",
                    render : {
                        css : {
                            dest : 'css/sprite.css'},
                        scss : {
                            dest : './sass/_sprite.scss'
                        }
                    },
                }
            }
        }))
        .pipe(gulp.dest('app/img//sprite/'));
});

//watch changes in sass folder
gulp.task('watch', ['browser-sync', 'css-libs'], function() { //['browserSync'..] - this runs all inside [] before watch
    gulp.watch('app/sass/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload); //watch HTML
    gulp.watch('app/js/*.js', browserSync.reload); //watch JS
});

// buile for production
gulp.task('build', ['clean', 'imgOptimization', 'sass'], function() {
    var buildCss = gulp.src([
        'app/css/main.css',
        'app/css/libs.min.css',
    ]).pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src('app/js/**/*')
        .pipe(gulp.dest('dist/js'));

    var guildHTML = gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));
});
