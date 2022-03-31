# Site-Novo-Nordisk-For-Bettha
A website about internship and trainee commissioned by Bettha
URL: http://dev-bettha-com-br.apache1.cloudsector.net/novo-nordisk/

For this project I used Sass to style. It means that you´ll need install the NPM (Node Package Manager) through NodeJS and GULP through NodeJS too.

Steps for help you:
1. Install nodejs. https://nodejs.org/en/

2. Check npm (node package manager) is installed via command prompt:
    $ npm
    
3. Install gulp:
    $ npm install gulp --global
    
4. In relevant project folder, create 'gulpfile.js':

    // build flow that copies MyNiceProgram.exe to another
    // directory (with forced folder creation and overwrite)
    var gulp = require('gulp');
    var exefile = 'some/bin/path/MyNiceProgram.exe';
    gulp.task('build', function(){
        gulp.src(exefile).pipe(gulp.dest('../../Binaries/'));
    });
    gulp.task('default', ['build'], function(){
        gulp.watch(exefile, ['build']);
    });

5. Run gulp:
    $ gulp
