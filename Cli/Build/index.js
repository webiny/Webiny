const Plugin = require('webiny-cli/lib/plugin');
const Menu = require('webiny-cli/lib/menu');

class Build extends Plugin {
    constructor(program) {
        super(program);

        program.option('-c, --config-set [configSet]', 'ConfigSet to use for production build.');
    }

    getMenu() {
        return new Menu('Production build');
    }

    runTask(config, onFinish) {
        const Task = require('./task');
        process.env.NODE_ENV = 'production';
        return this.processHook('before-build', {config, onFinish}).then(() => {
            const task = new Task(config);
            return task.run().then(stats => {
                return this.processHook('after-build', {config, onFinish, stats}).then(onFinish);
            });
        }).catch(onFinish);
    }

    runWizard(config, onFinish) {
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
            return this.runTask(config, onFinish);
        });
    }
}

Build.task = 'build';

module.exports = Build;