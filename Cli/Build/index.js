const _ = require('lodash');
const Webiny = require('webiny-cli/lib/webiny');
const Plugin = require('webiny-cli/lib/plugin');
const Menu = require('webiny-cli/lib/menu');

class Build extends Plugin {
    constructor(program) {
        super(program);

        const command = program.command('build <configSet>');
        command.description('Build apps using given config set.');
        this.addAppOptions(command);
        command.action((configSet, cmd) => {
            const config = _.assign({}, cmd.parent.opts(), cmd.opts(), {configSet});
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
            console.log('   - before-build');
            console.log('   - after-build');
            console.log();
        });
    }

    getMenu() {
        return new Menu('Production build');
    }

    runTask(config) {
        const Task = require('./task');
        process.env.NODE_ENV = 'production';
        return this.processHook('before-build', {config}).then(() => {
            const task = new Task(config);
            return task.run().then(stats => {
                return this.processHook('after-build', {config, stats});
            });
        });
    }

    runWizard(config) {
        const Webiny = require('webiny-cli/lib/webiny');
        const inquirer = require('inquirer');
        const yaml = require('js-yaml');

        const configSets = yaml.safeLoad(Webiny.readFile(Webiny.projectRoot('Configs/ConfigSets.yaml')));
        const choices = Object.keys(configSets.ConfigSets);

        return inquirer.prompt([{
            type: 'list',
            name: 'configSet',
            message: 'Select a config set to build',
            choices
        }]).then(answers => {
            config.configSet = answers.configSet;
            return this.runTask(config);
        });
    }
}

Build.task = 'build';

module.exports = Build;