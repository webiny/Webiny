const Menu = require('webiny/lib/menu');
const Plugin = require('webiny/lib/plugin');

class RunTests extends Plugin {
    constructor(program) {
        super(program);

        this.task = 'test';
        this.selectApps = true;
        program.option('-s, --source [source]', 'Test folder or file to run using Mocha.');
    }

    getMenu() {
        return new Menu('Run tests');
    }

    /**
     * This method will be used when running this plugin from a cli context (no GUI)
     *
     * @param config
     * @param onFinish
     */
    runTask(config, onFinish) {
        const Webiny = require('webiny/lib/webiny');
        const Mocha = require('mocha');
        const fs = require('fs-extra');
        const path = require('path');

        const mocha = new Mocha({reporter: 'spec'});

        let source = Webiny.projectRoot(config.source);
        if (source.endsWith('.js')) {
            mocha.addFile(source);
        } else {
            // Add each .js file to the mocha instance
            fs.readdirSync(source).filter(file => {
                // Only keep the .js files
                return file.substr(-3) === '.js';

            }).forEach(file => mocha.addFile(path.join(source, file)));
        }

        // Run the tests.
        mocha.run(failures => onFinish(failures));
    }

    /**
     * This method will be used when running JS app browser tests
     * @param config
     * @param onFinish
     * @returns {Promise.<TResult>}
     */
    runAppTests(config, onFinish) {
        const Webiny = require('webiny/lib/webiny');
        const inquirer = require('inquirer');
        const chalk = require('chalk');
        const glob = require('glob-all');
        const gulp = require('gulp');
        const mocha = require('gulp-mocha');
        const gulpCount = require('gulp-count');
        const babel = require('babel-register');

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
                                    presets: [
                                        require.resolve('babel-preset-es2015')
                                    ],
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

    runWizard(config, onFinish) {
        return this.runAppTests(config, onFinish);
    }
}

module.exports = RunTests;