const username = require('username');
const Plugin = require('webiny-cli/lib/plugin');
const Webiny = require('webiny-cli/lib/webiny');

function setupVirtualHost(answers) {
    const chalk = require('chalk');
    const {magenta, white} = chalk;

    // Create host file
    let hostFile = Webiny.readFile(__dirname + '/host.cfg');
    let server = answers.domain.replace('http://', '').replace('https://', '').split(':')[0];
    hostFile = hostFile.replace('{DOMAIN_HOST}', server);
    hostFile = hostFile.replace('{ABS_PATH}', Webiny.projectRoot());
    hostFile = hostFile.replace('{ERROR_LOG}', answers.errorLogFile);

    try {
        Webiny.writeFile(Webiny.projectRoot('vhost.conf'), hostFile);
        Webiny.success(white('Your nginx virtual host config was saved to ') + magenta('vhost.conf') + white(' file in your project root.'));
        Webiny.info('NOTE: you need to manually activate vhost config to finish the nginx setup.');
    } catch (err) {
        Webiny.failure(err);
    }

    return Promise.resolve(answers);
}

class Setup extends Plugin {
    constructor(program) {
        super(program);

        this.selectApps = false;
    }

    runWizard({env}) {
        const docker = env === 'docker';
        const inquirer = require('inquirer');
        const yaml = require('js-yaml');
        const _ = require('lodash');
        const generatePassword = require('password-generator');

        Webiny.log("\nNow we need to create a platform configuration and your first user:\n");

        const questions = [
            {
                type: 'input',
                name: 'domain',
                message: 'What\'s your local domain (e.g. http://domain.app:8001)?',
                validate: Webiny.validate.url
            },
            {
                type: 'input',
                name: 'database',
                message: 'What\'s your database name?',
                default: () => {
                    return 'webiny';
                }
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

            const configs = {
                configSets: Webiny.projectRoot('Configs/ConfigSets.yaml'),
                base: {
                    application: Webiny.projectRoot('Configs/Base/Application.yaml'),
                    database: Webiny.projectRoot('Configs/Base/Database.yaml'),
                    security: Webiny.projectRoot('Configs/Base/Security.yaml')
                },
                local: {
                    application: Webiny.projectRoot('Configs/Local/Application.yaml'),
                    marketplace: Webiny.projectRoot('Configs/Local/Marketplace.yaml'),
                    keys: Webiny.projectRoot('Configs/Local/Keys')
                }
            };

            try {
                // Populate ConfigSets.yaml
                let config = yaml.safeLoad(Webiny.readFile(configs.configSets));
                config.ConfigSets.Local = answers.domain;
                Webiny.writeFile(configs.configSets, yaml.safeDump(config, {indent: 4}));

                // Populate Base/Application.yaml
                config = yaml.safeLoad(Webiny.readFile(configs.base.application));
                config.Application.Acl.Token = generatePassword(40, false, /[\dA-Za-z#_\$]/);
                Webiny.writeFile(configs.base.application, yaml.safeDump(config, {indent: 4}));

                // Populate Base/Database.yaml
                config = yaml.safeLoad(Webiny.readFile(configs.base.database));
                config.Mongo.Services.Webiny.Calls[0][1] = [answers.database];
                Webiny.writeFile(configs.base.database, yaml.safeDump(config, {indent: 4, flowLevel: 5}));

                // Populate Base/Security.yaml
                config = yaml.safeLoad(Webiny.readFile(configs.base.security));
                config.Security.Tokens.Webiny.SecurityKey = generatePassword(30, false, /[\dA-Za-z#_\$:\?#]/);
                config.Security.TwoFactorAuth.Key = generatePassword(30, false, /[\dA-Za-z#_\$:\?#]/);
                Webiny.writeFile(configs.base.security, yaml.safeDump(config, {indent: 4, flowLevel: 5}));

                // Populate Local/Application.yaml
                config = yaml.safeLoad(Webiny.readFile(configs.local.application));
                config.Application.WebPath = answers.domain;
                config.Application.ApiPath = answers.domain + '/api';
                Webiny.writeFile(configs.local.application, yaml.safeDump(config, {indent: 4}));

                // Populate Local/Marketplace.yaml
                config = yaml.safeLoad(Webiny.readFile(configs.local.marketplace));
                config.Marketplace.Username = username.sync();
                Webiny.writeFile(configs.local.marketplace, yaml.safeDump(config, {indent: 4}));

                // Generate SSH keys to allow proper SSH from development machine onto itself
                Webiny.shellExecute(`mkdir -p ${configs.local.keys} && ssh-keygen -q -f ${configs.local.keys}/id_rsa -t rsa -N ''`);
                Webiny.shellExecute(`cat ${configs.local.keys}/id_rsa.pub >> ~/.ssh/authorized_keys`);

                Webiny.success('Configuration files written successfully!');
            } catch (err) {
                console.log(err);
                return;
            }

            if (docker) {
                Webiny.info('Initializing Docker containers...');
                // Run Docker containers so we can execute install scripts.
                Webiny.shellExecute('docker-compose up -d');
            }

            const php = docker ? 'docker-compose run php php ' : 'php ';

            // Run Webiny installation procedure
            Webiny.info('Running Webiny app installation...');
            Webiny.shellExecute(php + ' Apps/Webiny/Php/Cli/install.php Local Webiny');

            // Create admin user
            const params = [answers.user, answers.password].join(' ');
            try {
                let output = Webiny.shellExecute(php + ' Apps/Webiny/Php/Cli/admin.php Local ' + params, {stdio: 'pipe'});
                output = JSON.parse(output);
                if (output.status === 'created') {
                    Webiny.success('Admin user created successfully!');
                }

                if (output.status === 'exists') {
                    Webiny.exclamation('Admin user already exists!');
                }
            } catch (err) {
                Webiny.failure(err.message);
            }

            // Virtual host wizard
            const hostAnswers = {
                domain: answers.domain
            };

            const createHost = function () {
                return inquirer.prompt({
                    type: 'confirm',
                    name: 'createHost',
                    message: 'Would you like us to create a new nginx virtual host for you?',
                    default: true
                }).then(a => {
                    if (a.createHost) {
                        hostAnswers.createHost = true;
                        return errorLogFile();
                    }
                    return answers;
                });
            };

            const errorLogFile = function () {
                return inquirer.prompt({
                    type: 'input',
                    name: 'errorLogFile',
                    message: 'Where do you want to place your error log file (including file name)?',
                    default: function () {
                        const server = answers.domain.replace('http://', '').replace('https://', '').split(':')[0];
                        return '/var/log/nginx/' + server + '-error.log';
                    }
                }).then(a => {
                    hostAnswers.errorLogFile = a.errorLogFile;
                    return setupVirtualHost(hostAnswers);
                });
            };

            try {
                Webiny.shellExecute('nginx -v', {stdio: 'pipe'});
                return createHost();
            } catch (err) {
                // Skip host prompts
            }
        });
    }
}

Setup.task = 'setup';

module.exports = Setup;