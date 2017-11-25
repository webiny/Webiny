const _ = require('lodash');
const Webiny = require('webiny-cli/lib/webiny');
const Plugin = require('webiny-cli/lib/plugin');
const Menu = require('webiny-cli/lib/menu');

class Build extends Plugin {
    constructor(program) {
        super(program);

        this.selectApps = true;

        const command = program.command('build <environment>');
        command.description('Build apps using given environment.');
        this.addAppOptions(command);
        command.action((environment, cmd) => {
            const config = _.assign({}, cmd.parent.opts(), cmd.opts(), {environment});
            Webiny.runTask('build', config);
        }).on('--help', () => {
            console.log();
            console.log('  Examples:');
            console.log();
            console.log('    $ webiny-cli build Production -a Webiny.Core -a Webiny.Ui -a Webiny.Skeleton');
            console.log('    $ webiny-cli build Production --all');
            console.log();
            console.log('  Hooks:');
            console.log();
            console.log('   - before-build (config)');
            console.log('   - after-build (config, stats)');
            console.log('   - before-webpack-apps (configs)');
            console.log('   - before-webpack-vendors (configs)');
            console.log();
        });

        Webiny.on('build', ({data}) => {
            return Webiny.runTask('build', data, {api: true});
        });
    }

    getMenu() {
        return new Menu('Production build');
    }

    runTask(config) {
        const Task = require('./task');
        process.env.NODE_ENV = 'production';
        return Webiny.dispatch('before-build', {config}).then(() => {
            const task = new Task(config);
            return task.run().then(stats => {
                return Webiny.dispatch('after-build', {config, stats});
            });
        });
    }

    runWizard(config) {
        const Webiny = require('webiny-cli/lib/webiny');
        const inquirer = require('inquirer');
        const yaml = require('js-yaml');

        const environments = yaml.safeLoad(Webiny.readFile(Webiny.projectRoot('Configs/Environments.yaml')));
        const choices = Object.keys(environments.Environments);

        return inquirer.prompt([{
            type: 'list',
            name: 'environment',
            message: 'Select an environment to build',
            choices
        }]).then(answers => {
            config.environment = answers.environment;
            return this.runTask(config);
        });
    }
}

Build.task = 'build';

module.exports = Build;