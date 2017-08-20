const _ = require('lodash');
const Webiny = require('webiny-cli/lib/webiny');
const Plugin = require('webiny-cli/lib/plugin');
const Menu = require('webiny-cli/lib/menu');

class Revert extends Plugin {
    constructor(program) {
        super(program);

        this.selectApps = false;
    }

    getMenu() {
        return new Menu('Switch release').addLineAfter();
    }

    runTask(config) {
        const Task = require('./task');
        const task = new Task();
        return task.run(config);
    }

    runWizard(config) {
        const Webiny = require('webiny-cli/lib/webiny');
        const inquirer = require('inquirer');
        const _ = require('lodash');

        const lastRun = Webiny.getConfig().lastRun;
        return inquirer.prompt([
            {
                type: 'input',
                name: 'server',
                message: 'Enter SSH connection string (e.g. username@server.com:port):',
                default: lastRun.server || null
            },
            {
                type: 'input',
                name: 'rootFolder',
                message: 'Enter the root folder of your project on the server:',
                default: lastRun.rootFolder || '~/www'
            }, {
                type: 'input',
                name: 'website',
                message: 'Enter the domain of the website you are reverting:',
                validate: Webiny.validate.url,
                default: lastRun.website || null
            }, {
                type: 'input',
                name: 'basicAuth',
                message: 'Enter Basic Authentication credentials to access your website (leave blank if not required):'
            }
        ]).then(answers => {
            lastRun.server = answers.server;
            lastRun.website = answers.website;
            lastRun.rootFolder = answers.rootFolder;
            Webiny.saveConfig(_.assign(Webiny.getConfig(), {lastRun}));
            _.merge(config, answers);

            return this.runTask(config);
        });
    }
}

Revert.task = 'switch-release';

module.exports = Revert;