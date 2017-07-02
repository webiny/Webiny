const Plugin = require('webiny/lib/plugin');
const Menu = require('webiny/lib/menu');

class Revert extends Plugin {
    constructor(program) {
        super(program);

        this.task = 'revert';
        this.selectApps = false;
    }

    getMenu() {
        return new Menu('Switch release').addLineAfter();
    }

    runTask(config, onFinish) {
        const Task = require('./task');
        const task = new Task();
        return task.run(config).then(onFinish);
    }

    runWizard(config, onFinish) {
        const Webiny = require('webiny/lib/webiny');
        const inquirer = require('inquirer');
        const _ = require('lodash');

        const lastRun = Webiny.getConfig().lastRun;
        return inquirer.prompt([{
            type: 'input',
            name: 'host',
            message: 'Enter SSH connection string (e.g. username@server.com:port):',
            default: lastRun.host || null
        }, {
            type: 'input',
            name: 'domain',
            message: 'Enter the domain of the website you are reverting:',
            validate: Webiny.validate.url,
            default: lastRun.domain || null
        }, {
            type: 'input',
            name: 'basicAuth',
            message: 'Enter Basic Authentication credentials to access your website (leave blank if not required):'
        }]).then(answers => {
            lastRun.host = answers.host;
            Webiny.saveConfig(_.assign(Webiny.getConfig(), {lastRun}));
            _.merge(config, answers);

            return this.runTask(config, onFinish);
        });
    }
}

module.exports = Revert;