const inquirer = require('inquirer');
const chalk = require('chalk');
const moment = require('moment');
const glob = require('glob-all');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const gulpCount = require('gulp-count');
const babel = require('babel-register');
const Plugin = require('webiny/lib/plugin');
const Webiny = require('webiny/lib/webiny');

class RunTests extends Plugin {
    constructor(program) {
        super(program);

        this.task = 'run-tests';
        this.title = 'Run tests';
        this.selectApps = true;
    }

    runTask(config, onFinish) {
        return Promise.all(config.apps.map(appObj => {
            return new Promise(resolve => {
                glob(appObj.getSourceDir() + '/Tests/*.js', function (er, files) {
                    if (files.length < 1) {
                        return resolve();
                    }

                    return gulp.src(files)
                        .pipe(gulpCount('Running ## test(s) for ' + chalk.magenta(appObj.getName())))
                        .pipe(mocha({
                            reporter: 'spec',
                            compilers: {
                                js: babel({
                                    "presets": ["es2015"],
                                    resolveModuleSource: function (source) {
                                        if (source === 'Webiny/TestSuite') {
                                            return Webiny.projectRoot('Apps/Webiny/Js/Core/Lib/TestLib/TestSuite');
                                        }
                                        return source;
                                    }
                                })
                            }
                        }))
                        .on('end', resolve).on('error', function (e) {
                            Webiny.failure(e.message);
                        });
                });
            });
        })).then(onFinish);
    }
}

module.exports = RunTests;