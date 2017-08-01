const inquirer = require('inquirer');
const moment = require('moment');
const _ = require('lodash');
const Plugin = require('webiny-cli/lib/plugin');
const Menu = require('webiny-cli/lib/menu');
const Webiny = require('webiny-cli/lib/webiny');
const Task = require('./task');

class Release extends Plugin {
    constructor(program) {
        super(program);

        this.selectApps = false;

        program
            .command('release-archive <target>')
            .description('Create release archive ready for deployment to remote server.')
            .action((target, cmd) => {
                const config = _.assign({}, cmd.parent.opts(), cmd.opts(), {target});
                Webiny.runTask('release-archive', config);
            })
            .on('--help', () => {
                console.log();
                console.log('  Examples:');
                console.log();
                console.log('    $ webiny-cli release-archive ./releases/my-release.zip');
                console.log();
                console.log('  Hooks:');
                console.log();
                console.log('   - before-release-archive');
                console.log('   - after-release-archive');
                console.log();
            });
    }

    getMenu() {
        return new Menu('Create release archive').addLineBefore();
    }

    runTask(config) {
        return this.processHook('before-release-archive', {config}).then(() => {
            const task = new Task();
            return task.run(config).then(archive => {
                return this.processHook('after-release-archive', {config, archive});
            });
        });
    }

    runWizard(config, runTask) {
        return inquirer.prompt([{
            type: 'input',
            name: 'target',
            message: 'Where do you want to store the release archive (including file name)?',
            validate: function (value) {
                const writable = Webiny.validate.writable(value);
                if (writable !== true) {
                    return writable;
                }

                if (!value.endsWith('.zip')) {
                    return 'Please include a file name for your archive!';
                }
                return true;
            },
            default: function () {
                const zipName = 'release-' + moment().format('YYYYMMDD-HHmmss') + '.zip';
                return 'releases/' + zipName;
            }
        }]).then(answers => {
            config.target = answers.target;

            return this.runTask(config, runTask).then(() => {
                return inquirer.prompt([{
                    type: 'confirm',
                    name: 'deploy',
                    message: 'Do you want to deploy this release to remote server?',
                    default: true
                }]).then(answers => {
                    if (answers.deploy) {
                        config.archive = config.target;
                        return runTask('deploy', config);
                    }
                });
            });
        });
    }
}

Release.task = 'release-archive';

module.exports = Release;