const _ = require('lodash');
const Webiny = require('webiny-cli/lib/webiny');
const Menu = require('webiny-cli/lib/menu');
const Plugin = require('webiny-cli/lib/plugin');

class Deploy extends Plugin {
    constructor(program) {
        super(program);

        program
            .command('deploy <archive>')
            .description('Deploy release archive to remote server.')
            .option('-f, --rootFolder [rootFolder]', 'Root folder for your project on the server. Default: ~/www')
            .option('-s, --server [server]', 'SSH connection string to the target server.')
            .option('-w --website [website]', 'Website URL.') // https://github.com/tj/commander.js/issues/370
            .option('-b, --basic-auth [basicAuth]', 'Basic Authentication string for your target server.')
            .action((archive, cmd) => {
                const config = _.assign({}, cmd.parent.opts(), cmd.opts(), {archive});
                Webiny.runTask('deploy', config);
            })
            .on('--help', () => {
                console.log();
                console.log('  Examples:');
                console.log();
                console.log('    $ webiny-cli deploy ./releases/new-release.zip -s username@server.com:port -w https://mywebsite.com -b username:password');
                console.log();
            });
    }

    getMenu() {
        return new Menu('Deploy existing release archive').setOrder(145);
    }

    runTask(config) {
        const Task = require('./task');
        const task = new Task();
        return task.run(config);
    }

    runWizard(config) {
        const Webiny = require('webiny-cli/lib/webiny');
        const inquirer = require('inquirer');
        const moment = require('moment');
        const fs = require('fs-extra');
        const _ = require('lodash');

        const lastRun = Webiny.getConfig().lastRun;
        let steps = [
            {
                type: 'input',
                name: 'server',
                message: 'Enter SSH connection string (e.g. username@server.com:port):',
                default: lastRun.server || null,
                validate: (value) => {
                    if (value.length < 1) {
                        return 'Please enter an SSH connection string';
                    }
                    return true;
                }
            },
            {
                type: 'input',
                name: 'rootFolder',
                message: 'Enter the root folder of your project on the server:',
                default: lastRun.rootFolder || '~/www'
            },
            {
                type: 'input',
                name: 'website',
                message: 'Enter the domain of the website you are deploying:',
                validate: Webiny.validate.domain,
                default: lastRun.website || null
            }, {
                type: 'input',
                name: 'basicAuth',
                message: 'Enter Basic Authentication credentials to access your website (leave blank if not required):'
            }
        ];

        if (!config.archive) {
            // Prepend a new step with release archives selection
            const options = {cwd: fs.realpathSync(process.env.PWD), env: process.env, stdio: 'pipe'};
            const res = Webiny.execSync('ls -1t ' + Webiny.projectRoot('releases') + '/*.zip', options);

            const list = res.toString();
            const choices = [];
            _.trimEnd(list, '\n').split('\n').map(function (line) {
                choices.push('releases/' + _.trimEnd(line, '/').split('/').pop());
            });

            steps.unshift({
                type: 'list',
                choices,
                name: 'archive',
                message: 'Select a release to deploy:'
            });
        }

        return inquirer.prompt(steps).then(answers => {
            _.merge(config, answers);
            lastRun.server = answers.server;
            lastRun.website = answers.website;
            lastRun.rootFolder = answers.rootFolder;

            Webiny.saveConfig(_.assign(Webiny.getConfig(), {lastRun}));
            return this.runTask(config);
        });
    }
}

Deploy.task = 'deploy';

module.exports = Deploy;