const _ = require('lodash');
const Webiny = require('webiny-cli/lib/webiny');
const Menu = require('webiny-cli/lib/menu');
const Plugin = require('webiny-cli/lib/plugin');

class RunTests extends Plugin {
    constructor(program) {
        super(program);

        this.selectApps = true;

        const command = program.command('test');
        command.description('Run tests using Mocha.');
        this.addAppOptions(command);
        command.option('-s, --source [source]', 'Folder or file containing tests.');
        command.action(cmd => {
            const config = _.assign({}, cmd.parent.opts(), cmd.opts());
            Webiny.runTask('test', config);
        }).on('--help', () => {
            console.log();
            console.log('  NOTE: options -s and -a are mutually exclusive.');
            console.log();
            console.log('  Examples:');
            console.log();
            console.log('    $ webiny-cli test -a CronManager.Backend');
            console.log('    $ webiny-cli test -s Apps/Webiny/Tests/Api');
            console.log();
        });
    }

    getMenu() {
        return new Menu('Run tests');
    }

    /**
     * This method will be used when running this plugin from a cli context (no GUI)
     *
     * @param config
     */
    runTask(config) {
        if (config.source) {
            this.runTestsFromSource(config);
        } else {
            this.runBrowserTests(config);
        }
    }

    runTestsFromSource(config) {
        const Webiny = require('webiny-cli/lib/webiny');
        const Mocha = require('mocha');
        const fs = require('fs-extra');
        const path = require('path');
        const babel = require('babel-register');

        const mocha = new Mocha({
            reporter: 'spec',
            compilers: {
                js: babel({
                    presets: [
                        [require.resolve('babel-preset-env'), {
                            "targets": {
                                "node": "current"
                            }
                        }],
                        require.resolve('babel-preset-react'),
                    ],
                    resolveModuleSource: function (source) {
                        if (source === 'Webiny/TestSuite') {
                            return Webiny.projectRoot('Apps/Webiny/Js/Core/Lib/TestLib/TestSuite');
                        }
                        return source;
                    }
                })
            }
        });

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
        return new Promise(resolve => {
            mocha.run(failures => resolve(failures));
        });
    }

    /**
     * This method will be used when running JS app browser tests
     * @param config
     * @returns {Promise.<TResult>}
     */
    runBrowserTests(config) {
        const Webiny = require('webiny-cli/lib/webiny');
        const inquirer = require('inquirer');
        const chalk = require('chalk');
        const glob = require('glob-all');
        const gulp = require('gulp');
        const mocha = require('gulp-mocha');
        const gulpCount = require('gulp-count');
        const babel = require('babel-register');

        return Promise.all(config.apps.map(appObj => {
            return new Promise((resolve, reject) => {
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
                                        [require.resolve('babel-preset-env'), {
                                            "targets": {
                                                "node": "current"
                                            }
                                        }],
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
                            reject();
                        });
                });
            });
        }));
    }
}

RunTests.task = 'test';

module.exports = RunTests;