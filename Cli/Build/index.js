const Plugin = require('webiny/lib/plugin');
const Menu = require('webiny/lib/menu');
const Webiny = require('webiny/lib/webiny');
const inquirer = require('inquirer');
const yaml = require('js-yaml');
const Task = require('./task');

class Build extends Plugin {
    constructor(program) {
        super(program);

        this.task = 'build';

        program.option('-c, --config-set [configSet]', 'ConfigSet to use for production build.');
    }

    getMenu() {
        return new Menu('Production build');
    }

    runTask(config, onFinish) {
        process.env.NODE_ENV = 'production';
        const task = new Task(config);
        return task.run().then(onFinish);
    }

    runWizard(config, onFinish) {
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

module.exports = Build;