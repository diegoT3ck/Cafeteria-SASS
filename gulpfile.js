const { src, dest, watch, series, parallel} = require('gulp');
// CSS y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
// Se utiliza en dos pipe diferentes, 
//  un pipe antes de compilarlo
// antes de llearlo a otra carpeta
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

// Imagenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');
function css(done ) {
    // compilar sass
    // Passos: 1 -- identificar archivos, 2 - compilar, 3 - guardar el .css
    src('src/scss/app.scss') // Identificar
        .pipe( sourcemaps.init() )
        .pipe( sass(  ) ) // Compilar | {outputStyle: 'compressed'} comprimir archivos
        .pipe( postcss([autoprefixer(), cssnano()]) )
        .pipe( sourcemaps.write('.') )
        .pipe( dest('build/css') ) // Guardar CSS compilado
        done(); // salir
}
function dev() {
    // watch espera el cambio del archivo y ejecuta una funcion al detectar cambios
    watch( 'src/scss/**/*.scss', css )
    // Agregamos otro watch para las imagenes
    watch( 'src/img/**/*', imagenes);
}
function imagenes(done ) {
    src('src/img/**/*')
        .pipe( imagemin({ optimizationLevel: 3 }) )
        .pipe( dest('build/img') );
        done();
}
function versionWebp() {
    const opciones = {
        quality: 50,
    }
    return src('src/img/**/*.{png,jpg}')
            .pipe( webp( opciones ) )
            .pipe( dest('build/img')); 
}
function versionAvif() {
    const opciones = {
        quality: 50,
    }
    return src('src/img/**/*.{png,jpg}')
            .pipe( avif( opciones ) )
            .pipe( dest('build/img')); 
}

function tareaDedault() {
    console.log('')
}
exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
// series, parallel
exports.default = series(imagenes, versionWebp, versionAvif, css, dev) // (dev, watch)
// series .. Se inicia una tarea, y hasta que finaliza, inicia la siguiente
// Parallel .. Todas inician al mismo tiempo
/* 
--save-dev gulp
--save-dev sass gulp-sass
--save-dev autoprefixer gulp-postcss
--save-dev postcss
--save-dev gulp-imagemin@7.1.0
--save-dev gulp-webp

*/