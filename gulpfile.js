const gulp = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer');
const terser = require('gulp-terser');
const browserSync = require('browser-sync');
const concat  = require('gulp-concat')
const cssnano = require('gulp-cssnano')
const clean = require('gulp-clean')

// Limpa a pasta dist
// --------------------------------------------------
gulp.task('clean', function(){
    return gulp.src('dist')
        .pipe(clean());
})


// Copia as pastas de src para a pasta dist
// --------------------------------------------------
gulp.task('copy', function() {
    return gulp.src([
            'src/css/**/*', 
            'src/js/**/*'], 
            {"base": "src"})
        .pipe(gulp.dest('./dist/js/'))
})

// Pega todos os arquivos .scss e faz o tratamento, jogando ele em dist/css
// --------------------------------------------------
gulp.task('sass', function() {
    return gulp.src('./src/sass/**/*.scss') 
        .pipe(sass()) //trata o scss para css
        .pipe(autoprefixer()) //adiciona prefixos em regras de css baseado no Can I Use
        .pipe(cssnano()) // otimiza o css
        .pipe(gulp.dest('./dist/css/')); 
})

// Faz o tratamento performático nos arquivos de javascript
// --------------------------------------------------
gulp.task('buildjs', function() {
    return gulp.src('./src/js/**/*.js')
        .pipe(concat('app.min.js')) //concatena tudo neste arquivo novo
        .pipe(terser()) //minifica :3
        .pipe(gulp.dest('./dist/js/'))
})

// Executa a task "html" e "copy", depois as demais tarefas em paralelo
// --------------------------------------------------
gulp.task('dist', gulp.series('copy', gulp.parallel('sass', 'buildjs')), function(done) {
    done()
})

// Servidor lindinho que dá reload :3
// --------------------------------------------------
gulp.task('server',  function() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    })

    gulp.watch('./*/src/**/*').on('change', browserSync.reload);
})

// Vai ficar escutando os eventos <3
// --------------------------------------------------
gulp.task('listen', function() {
    gulp.watch('./src/sass/**/*.scss', gulp.series('sass')); 
    gulp.watch('./src/js/**/*', gulp.series('buildjs'))
});