const username = require('username');
const _ = require('lodash');
const Plugin = require('webiny-cli/lib/plugin');
const Webiny = require('webiny-cli/lib/webiny');

function setupDockerVirtualHost(answers) {
    // Create host file
    let hostFile = Webiny.readFile(Webiny.projectRoot('docker-nginx.conf'));
    let server = answers.domain.replace('http://', '').replace('https://', '').split(':')[0];
    hostFile = hostFile.replace('{DOMAIN_HOST}', server);

    try {
        Webiny.writeFile(Webiny.projectRoot('docker-nginx.conf'), hostFile);
    } catch (err) {
        Webiny.failure(err);
    }
}

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
        Webiny.info('EXAMPLE: ' + magenta('sudo ln -s ' + Webiny.projectRoot('vhost.conf') + ' /etc/nginx/sites-enabled/' + server));
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
        const interfaces = require('./interfaces');

        // Save env as it needs to be available as soon as possible for conditional execution
        const wConfig = Webiny.getConfig();
        wConfig.env = env;
        Webiny.saveConfig(wConfig);

        Webiny.log("\nNow we need to create a platform configuration and your first user:\n");

        // Need this later in setup
        let nginxPort = null;

        // Define wizard questions
        const questions = [
            {
                type: 'input',
                name: 'domain',
                message: 'What\'s your local domain (e.g. http://domain.app:8000)?',
                validate: url => {
                    let valid = Webiny.validate.domain(url);
                    // Check if URL contains port which is mandatory for Docker setup
                    if (valid === true && docker) {
                        const message = 'Docker requires a port to be provided. Please add a port number to the URL.';
                        nginxPort = parseInt(_.get(url.split(':'), 2));
                        if (_.isNaN(nginxPort)) {
                            return message;
                        }
                    }
                    return valid;
                }
            },
            {
                type: 'list',
                choices: interfaces(),
                name: 'hostIp',
                message: 'Select your host IP address:',
                when: docker
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
                name: 'databasePort',
                when: docker,
                message: 'What\'s your mongodb service port?',
                default: ({domain}) => {
                    try {
                        return parseInt(domain.split(':')[2]) + 1;
                    } catch (e) {
                        return '';
                    }
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
                dockerCompose: Webiny.projectRoot('docker-compose.yaml'),
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

            try {
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

                // Populate docker-compose.yaml
                if (docker) {
                    config = yaml.safeLoad(Webiny.readFile(configs.dockerCompose));
                    config.services.nginx.ports.push(nginxPort + ':80');

                    let alias = answers.domain;
                    alias = alias.replace('http://', '').replace('https://', '').split(':')[0];
                    config.services.nginx.networks.default.aliases.push(alias);

                    config.services.php.extra_hosts.push('dockerhost:' + answers.hostIp);
                    config.services.php.environment.XDEBUG_CONFIG = `remote_enable=0 remote_host=${answers.hostIp}`;
                    config.services.mongodb.ports.push(answers.databasePort + ':27017');

                    // For windows we will use a special volume instead of a shared folder on host
                    if (process.platform === "win32") {
                        config.services.mongodb.volumes[0] = 'mongodb:/data';
                        _.set(config, 'volumes.mongodb.external', true);
                    }

                    Webiny.writeFile(configs.dockerCompose, yaml.safeDump(config, {indent: 4}));
                    setupDockerVirtualHost(answers);
                }

                Webiny.success('Configuration files written successfully!');

                // We need to store the env if the project is run using docker
                if (docker) {
                    const wConfig = Webiny.getConfig();
                    wConfig.env = 'docker';
                    // Set default browserSync port for Docker only
                    wConfig.browserSync = {port: 3010};
                    Webiny.saveConfig(wConfig);
                }
            } catch (err) {
                Webiny.failure(err.message, err);
                return;
            }

            if (docker) {
                Webiny.info('Initializing Docker containers...');
                // For windows we need to create a special volume for mongo data
                if (process.platform === "win32") {
                    Webiny.shellExecute('docker volume create --name=mongodb');
                }
                // Run Docker containers so we can execute install scripts.
                Webiny.shellExecute('docker-compose up -d');
            }

            const php = docker ? 'docker-compose run php php' : 'php';

            // Run Webiny installation procedure
            Webiny.info('Running Webiny app installation...');
            Webiny.shellExecute(`${php} Apps/Webiny/Php/Cli/install.php Local Webiny`);

            // Create admin user
            const params = [answers.user, answers.password].join(' ');
            try {
                let output = Webiny.shellExecute(`${php} Apps/Webiny/Php/Cli/admin.php Local ${params}`, {stdio: 'pipe'});
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
            if (docker) {
                return answers;
            }

            // Optionally create nginx config
            try {
                // Virtual host wizard
                const hostAnswers = {
                    domain: answers.domain
                };

                Webiny.shellExecute('nginx -v', {stdio: 'pipe'});
                return inquirer.prompt({
                    type: 'confirm',
                    name: 'createHost',
                    message: 'Would you like us to create a new nginx virtual host for you?',
                    default: true
                }).then(a => {
                    if (a.createHost) {
                        hostAnswers.createHost = true;
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
                    }
                    return answers;
                });
            } catch (err) {
                // Skip host prompts
            }
        });
    }
}

Setup.task = 'setup';

module.exports = Setup;