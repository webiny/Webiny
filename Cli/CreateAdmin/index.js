const Menu = require('webiny-cli/lib/menu');
const Plugin = require('webiny-cli/lib/plugin');
const chalk = require('chalk');

class CreateAdmin extends Plugin {
    constructor(program) {
        super(program);

        this.selectApps = false;
    }

    getMenu() {
        return new Menu('Create admin user');
    }

    runTask(config) {
        const Webiny = require('webiny-cli/lib/webiny');
        return new Promise((resolve, reject) => {
            try {
                // Execute an admin.php script
                const params = [
                    'php',
                    Webiny.projectRoot('Apps/Webiny/Php/Cli/admin.php'),
                    'Local',
                    config.user,
                    config.password
                ];

                let output = Webiny.shellExecute(params.join(' '), {stdio: 'pipe'});
                output = JSON.parse(output);
                if (output.status === 'created') {
                    Webiny.success('Admin user created successfully!');
                }

                if (output.status === 'exists') {
                    Webiny.exclamation('Admin user already exists!');
                }

                resolve(config);
            } catch (e) {
                Webiny.failure('Failed to create user ' + chalk.cyan(config.user) + '!', e);
                reject(e);
            }
        });
    }

    runWizard() {
        const Webiny = require('webiny-cli/lib/webiny');
        const inquirer = require('inquirer');
        return inquirer.prompt([
            {
                type: 'input',
                name: 'user',
                message: 'Enter your admin user email:',
                validate: Webiny.validate.email
            },
            {
                type: 'password',
                name: 'password',
                message: 'Enter your admin user password:',
                validate: (value) => {
                    if (value !== 'dev' && value !== 'admin' && value.length < 8) {
                        return 'Please enter at least 8 characters!';
                    }

                    return true;
                }
            }
        ]).then(answers => {
            return this.runTask(answers);
        });
    }
}

CreateAdmin.task = 'create-admin';

module.exports = CreateAdmin;