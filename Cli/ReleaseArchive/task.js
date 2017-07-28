const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const chalk = require('chalk');
const gulp = require('gulp');
const gulpZip = require('gulp-zip');
const gulpPrint = require('gulp-print');
const Webiny = require('webiny-cli/lib/webiny');

class Release {
    run(config) {
        Webiny.info('\nCreating release archive...');
        const paths = [
            'Apps/**/*',
            '!Apps/**/node_modules/**/*',
            '!Apps/**/Js/**/*',
            '!Apps/**/*.git',
            'Configs/**/*.yaml',
            'public_html/build/production/**/*',
            'public_html/*.{php,html}',
            'public_html/robots.txt',
            'vendor/**/*.{php,crt,ser}',
            '!vendor/**/[tT]est*/**/*',
            '!vendor/**/*.git'
        ];

        const parts = path.parse(config.target);
        if (!parts.dir.startsWith('/') && !parts.dir.startsWith('~/')) {
            parts.dir = Webiny.projectRoot(parts.dir);
        }

        if (parts.dir.startsWith('~/')) {
            parts.dir = parts.dir.replace('~/', os.homedir() + '/');
        }

        parts.dir = path.resolve(parts.dir);

        return new Promise((resolve, reject) => {
            gulp.src(paths, {base: '.'})
                .pipe(gulpZip(parts.name + '.zip'))
                .pipe(gulp.dest(parts.dir))
                .pipe(gulpPrint(() => {
                    Webiny.success('Done! Archive saved to ' + chalk.magenta(config.target) + '\n');
                })).on('end', () => resolve(config.target)).on('error', reject);
        });
    }
}
module.exports = Release;