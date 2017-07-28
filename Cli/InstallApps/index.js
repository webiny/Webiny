const Menu = require('webiny-cli/lib/menu');
const Plugin = require('webiny-cli/lib/plugin');

const fallback = [
    {
        "name": "Demo",
        "description": "This is a demo app showing how to create your own backend app. It showcases different types of views and components with lots of examples to get you started.",
        "version": "dev-master",
        "repository": "https://github.com/Webiny/Demo.git",
        "packagist": "webiny/demo"
    },
    {
        "name": "CronManager",
        "description": "Manage your cron jobs using simple and intuitive UI with in-depth stats.",
        "version": "dev-master",
        "repository": "https://github.com/Webiny/CronManager.git",
        "packagist": "webiny/cron-manager"
    },
    {
        "name": "NotificationManager",
        "description": "Manage your email notifications with ease using email and layout templates, delivery stats and more.",
        "version": "dev-master",
        "repository": "https://github.com/Webiny/NotificationManager.git",
        "packagist": "webiny/notification-manager"
    },
    {
        "name": "BackupApp",
        "description": "Easily set up your system backup to Amazon S3 with just a few clicks.",
        "version": "dev-master",
        "repository": "https://github.com/Webiny/BackupApp.git",
        "packagist": "webiny/backup-app"
    },
    {
        "name": "SystemMonitor",
        "description": "Monitor all of your system resources (server performance, API and DB) on one or multiple servers.",
        "version": "dev-master",
        "repository": "https://github.com/Webiny/SystemMonitor.git",
        "packagist": "webiny/system-monitor"
    }
];

class InstallApps extends Plugin {
    constructor(program) {
        super(program);

        this.selectApps = false;
    }

    getMenu() {
        return new Menu('Install apps');
    }

    runTask(config) {
        const Webiny = require('webiny-cli/lib/webiny');
        const fetch = require('node-fetch');

        const appsSource = 'http://www.webiny.com/api/services/the-hub/marketplace/apps';
        Webiny.info('Fetching list of available apps...');
        return fetch(appsSource).then(function (res) {
            return res.json().then(json => {
                return this.renderWizard(json.data);
            });
        }).catch(() => {
            return this.renderWizard(fallback);
        });
    }

    renderWizard(options) {
        const Webiny = require('webiny-cli/lib/webiny');
        const _ = require('lodash');
        const chalk = require('chalk');
        const inquirer = require('inquirer');
        return inquirer.prompt([
            {
                type: 'checkbox',
                name: 'apps',
                message: 'Select Webiny apps to install',
                choices: options.map(o => {
                    return {
                        name: chalk.cyan(o.name) + ' (' + chalk.magenta(o.version) + '): ' + o.description,
                        value: o.name,
                        disabled: Webiny.folderExists(Webiny.projectRoot('Apps/' + o.name)) ? chalk.green('Installed') : false
                    };
                }),
                validate: function (answer) {
                    if (answer.length < 1) {
                        return 'You must choose at least one option';
                    }

                    return true;
                }
            }
        ]).then(answers => {
            const Installer = require('./installer');
            return Promise.all(answers.apps.map(a => {
                const app = _.find(options, {name: a});
                const installer = new Installer();
                return installer.run(_.pick(app, ['name', 'packagist', 'repository']));
            }));
        });
    }
}

InstallApps.task = 'install-apps';

module.exports = InstallApps;