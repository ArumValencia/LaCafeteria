
const { src, dest, watch, series } = require('gulp');

// CSS SASS
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const postcss  = require('gulp-postcss');

// IMAGENES
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

function css( done ) {
    // Compilar Sass
    // pasos: 1-Identificar archivo, 2-Compilar, 3-Guardar el .css

    src('src/scss/app.scss')
        .pipe( sourcemaps.init() )
        .pipe( sass() )
        .pipe( postcss( [autoprefixer(), cssnano() ] ) )
        .pipe( sourcemaps.write('.') )
        .pipe( dest('build/css') )

    done();
}

function imagenes( done ) {
    src('src/img/**/*')
        .pipe( imagemin({ optimizationLevel: 3 }) )
        .pipe( dest('build/img') )
    
    done();
}
function versionWebp (){
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
        .pipe( webp( opciones ) )
        .pipe( dest('build/img') )
}
function versionAvif (){
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
        .pipe( avif( opciones ) )
        .pipe( dest('build/img') )
}

function dev() {
    // le decimos atento a lo que pase en ese archivo y si hay cambios llamar a la funcion css
    watch( 'src/scss/**/*.scss', css);  
    watch('src/img/**/*', imagenes );
}

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series( imagenes, versionAvif, versionWebp, css, dev );

// series - se inicia una tarrea y hasta que no finaliza no inicia la siguente
// parallel - Todas inician al mismo tiempo