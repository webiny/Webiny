const Plugin = require('webiny-cli/lib/plugin');
const Webiny = require('webiny-cli/lib/webiny');
const url = require('url');

function setupVirtualHost(answers) {
    const chalk = require('chalk');
    const {magenta, white} = chalk;

    // Create host file
    let hostFile = Webiny.readFile(__dirname + '/host.cfg');
    let server = answers.domain.replace('http://', '').replace('https://', '').split(':')[0];
    const errorLogFile = '/var/log/nginx/' + server + '-error.log';
    hostFile = hostFile.replace('{DOMAIN_HOST}', server);
    hostFile = hostFile.replace('{ABS_PATH}', Webiny.projectRoot());
    hostFile = hostFile.replace('{ERROR_LOG}', errorLogFile);

    try {
        Webiny.writeFile(Webiny.projectRoot('nginx.conf'), hostFile);
        Webiny.success(white('Your nginx virtual host config was saved to ') + magenta('nginx.conf') + white(' file in your project root.'));
        Webiny.info('NOTE: you need to manually activate vhost config to finish the nginx setup.');
        Webiny.info('EXAMPLE: ' + magenta('sudo ln -s ' + Webiny.projectRoot('nginx.conf') + ' /etc/nginx/sites-enabled/' + server));
    } catch (err) {
        Webiny.failure(err);
    }
}

class Setup extends Plugin {
    constructor(program) {
        super(program);

        this.selectApps = false;
    }

    runTask(answers) {
        return new Promise((resolve, reject) => {
            const docker = process.env.WEBINY_ENVIRONMENT === 'docker';
            const yaml = require('js-yaml');
            const generatePassword = require('password-generator');

            const configs = {
                environments: Webiny.projectRoot('Configs/Environments.yaml'),
                base: {
                    application: Webiny.projectRoot('Configs/Base/Webiny.yaml'),
                    database: Webiny.projectRoot('Configs/Base/Database.yaml'),
                    security: Webiny.projectRoot('Configs/Base/Security.yaml')
                },
                local: {
                    application: Webiny.projectRoot('Configs/Local/Webiny.yaml')
                }
            };

            // Populate Environments.yaml
            let config = yaml.safeLoad(Webiny.readFile(configs.environments));
            config.Environments.Local = answers.domain;
            Webiny.writeFile(configs.environments, yaml.safeDump(config, {indent: 4}));

            // Populate Base/Webiny.yaml
            config = yaml.safeLoad(Webiny.readFile(configs.base.application));
            config.Webiny.Acl.Token = generatePassword(40, false, /[\dA-Za-z#_\$]/);
            Webiny.writeFile(configs.base.application, yaml.safeDump(config, {indent: 4}));

            // Populate Base/Database.yaml
            config = yaml.safeLoad(Webiny.readFile(configs.base.database));
            config.Mongo.Services.Webiny.Calls[0][1] = [answers.database];
            if (docker) {
                config.Mongo.Services.Webiny.Arguments.Uri = 'mongodb:27017';
            }
            Webiny.writeFile(configs.base.database, yaml.safeDump(config, {indent: 4, flowLevel: 5}));

            // Populate Base/Security.yaml
            config = yaml.safeLoad(Webiny.readFile(configs.base.security));
            config.Security.Tokens.Webiny.SecurityKey = generatePassword(30, false, /[\dA-Za-z#_\$:\?#]/);
            config.Security.TwoFactorAuth.Key = generatePassword(30, false, /[\dA-Za-z#_\$:\?#]/);
            Webiny.writeFile(configs.base.security, yaml.safeDump(config, {indent: 4, flowLevel: 5}));

            // Populate Local/Webiny.yaml
            config = yaml.safeLoad(Webiny.readFile(configs.local.application));
            config.Webiny.WebUrl = answers.domain;
            config.Webiny.ApiUrl = answers.domain + '/api';
            Webiny.writeFile(configs.local.application, yaml.safeDump(config, {indent: 4}));

            Webiny.success('Configuration files written successfully!');

            const wConfig = Webiny.getConfig();
            const u = url.parse(answers.domain);
            wConfig.cli = {
                domain: u.protocol + '//' + u.hostname,
                port: answers.cliPort || 3000
            };

            // We need to store the env if the project is run using docker
            if (docker) {
                wConfig.env = 'docker';
            }
            Webiny.saveConfig(wConfig);

            // Run Webiny installation procedure
            Webiny.info('Running Webiny app installation...');
            Webiny.shellExecute(`php Apps/Webiny/Php/Cli/install.php Local Webiny`);

            // Create admin user
            const params = [answers.user, answers.password].join(' ');
            try {
                let output = Webiny.shellExecute(`php Apps/Webiny/Php/Cli/admin.php Local ${params}`, {stdio: 'pipe'});
                output = JSON.parse(output);
                if (output.status === 'created') {
                    Webiny.success('Admin user created successfully!');
                }

                if (output.status === 'failed') {
                    Webiny.exclamation(output.message);
                }
            } catch (err) {
                Webiny.failure(err.message);
            }

            // If Docker - we do not run nginx setup wizard
            if (!docker) {
                setupVirtualHost(answers);
            }
            resolve(answers);
        });
    }

    runWizard() {
        const docker = process.env.WEBINY_ENVIRONMENT === 'docker';
        const inquirer = require('inquirer');
        const _ = require('lodash');

        // Save env as it needs to be available as soon as possible for conditional execution
        const wConfig = Webiny.getConfig();
        wConfig.env = env;
        Webiny.saveConfig(wConfig);

        Webiny.log("\nNow we need to create a platform configuration and your first user:\n");

        // Define wizard questions
        const questions = [
            {
                type: 'input',
                name: 'domain',
                message: 'What\'s your local domain (e.g. http://domain.app:8000)?',
                validate: Webiny.validate.domain
            },
            {
                type: 'input',
                name: 'database',
                message: 'What\'s your database name?',
                default: 'webiny'
            },
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
        ];

        return inquirer.prompt(questions).then(function (answers) {
            answers.domain = _.trimEnd(answers.domain, '/');

            return this.runTask(answers);
        });
    }
}

Setup.task = 'setup';

module.exports = Setup;