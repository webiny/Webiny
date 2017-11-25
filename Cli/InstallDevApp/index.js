const Webiny = require('webiny-cli/lib/webiny');
const Plugin = require('webiny-cli/lib/plugin');
const Menu = require('webiny-cli/lib/menu');
const inquirer = require('inquirer');
const _ = require('lodash');

class InstallDevApp extends Plugin {
    constructor(program) {
        super(program);

        program
            .command('install-dev-app <repo>')
            .description(`Install a development version of an app from a git repository (uses 'master' branch)`)
            .action((target, cmd) => {
                const config = _.assign({}, cmd.parent.opts(), cmd.opts(), {target});
                Webiny.runTask('install-dev-app', config);
            })
            .on('--help', () => {
                console.log();
                console.log('  Examples:');
                console.log();
                console.log('    $ webiny-cli install-dev-app git@github.com:Webiny/MyApp.git');
                console.log();
            });
    }

    getMenu() {
        return new Menu('Install app from repo').addLineBefore();
    }

    runTask(config) {
        this.appPath = Webiny.projectRoot('Apps/tmp-app');
        Webiny.info('Cloning repo...');
        return Webiny.shellAsync(`git clone ${config.repo} ${this.appPath}`, {}, Webiny.log).then(() => {
            const yaml = require('js-yaml');
            // Get actual app name
            const appYaml = yaml.safeLoad(Webiny.readFile(this.appPath + '/App.yaml'));
            this.appName = appYaml.Name;

            const fs = require('fs-extra');
            const newPath = Webiny.projectRoot('Apps/' + this.appName);
            if (fs.existsSync(newPath)) {
                // Remove cloned directory
                fs.removeSync(this.appPath);
                throw Error(`An app called ${this.appName} is already installed!`);
            }

            fs.renameSync(this.appPath, newPath);
            this.appPath = newPath;

            // Enable app
            const appsYaml = 'Configs/Base/Apps.yaml';
            const configPath = Webiny.projectRoot(appsYaml);
            Webiny.info(`Enabling app in ${appsYaml}...`);
            let config = yaml.safeLoad(Webiny.readFile(configPath));
            config.Apps[this.appName] = true;
            Webiny.writeFile(configPath, yaml.safeDump(config, {indent: 4}));
        }).then(() => {
            Webiny.info('Installing roles, permissions and DB indexes...');
            const params = [
                'php',
                'Apps/Webiny/Php/Cli/install.php',
                'Local',
                this.appName
            ];
            return Webiny.shellAsync(params.join(' ')).then(() => {
                if (!Webiny.fileExists(`Apps/${this.appName}/package.json`)) {
                    return;
                }
                Webiny.info('Installing JS dependencies...');
                const params = [
                    `cd ${this.appPath}`,
                    `yarn install`,
                    `cd ${Webiny.projectRoot()}`
                ];
                return Webiny.shellAsync(params.join(' && '));
            }).then(() => {
                Webiny.success(`App ${this.appName} installed successfully!`);
            });
        }).catch(e => {
            if (_.isPlainObject(e) && e.error) {
                throw Error(e.error);
            }
            throw e;
        });
    }

    runWizard(config) {
        return inquirer.prompt([{
            type: 'input',
            name: 'repo',
            message: 'Enter a git repository:'
        }]).then(answers => {
            return this.runTask(answers);
        });
    }
}

InstallDevApp.task = 'install-dev-app';

module.exports = InstallDevApp;