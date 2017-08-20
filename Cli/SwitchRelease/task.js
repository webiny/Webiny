const path = require('path');
const inquirer = require('inquirer');
const SshClient = require('node-sshclient');
const chalk = require('chalk');
const _ = require('lodash');
const Webiny = require('webiny-cli/lib/webiny');

class Revert {
    run(config) {
        const folder = 'production';
        let rootFolder = _.trimEnd(config.rootFolder, '/');
        if (rootFolder === '') {
            rootFolder = '~/www';
        }
        let port = 22;
        let host = config.server;
        let user = null;
        let domain = null;

        if (host.indexOf(':') > -1) {
            const parts = host.split(':');
            host = parts[0];
            port = parts[1];
        }

        const hostParts = host.split('@');
        if (hostParts.length === 2) {
            user = hostParts[0];
            domain = hostParts[1];
        } else {
            domain = hostParts[0];
        }

        const sshConfig = {
            hostname: domain,
            user: user,
            port: port
        };

        const ssh = new SshClient.SSH(sshConfig);

        return new Promise((resolve, reject) => {
            try {
                ssh.command(`ls -1d ${rootFolder}/releases/*/`, res => {
                    const list = res.stdout;
                    let choices = [];
                    _.trimEnd(list, '\n').split('\n').map(function (line) {
                        choices.push(_.trimEnd(line, '/').split('/').pop());
                    });

                    choices = choices.filter(c => c !== '');

                    if (choices.length === 0) {
                        reject('We could not find any releases in the given project folder.');
                        return;
                    }

                    inquirer.prompt({
                        type: 'list',
                        choices: choices,
                        name: 'release',
                        message: 'Select a release to activate:'
                    }).then(answers => {
                        const activate = [
                            `rm -f ${rootFolder}/active/${folder}`,
                            `ln -s ${rootFolder}/releases/${answers.release} ${rootFolder}/active/${folder}`
                        ].join('&&');
                        ssh.command(activate, () => {
                            Webiny.info(`Clearing cache for ${chalk.magenta(config.website)}...`);
                            ssh.command(this.flushCache(config), res => {
                                const commandOut = res.stdout || '{}';
                                if (res.exitCode !== 0 || _.get(JSON.parse(commandOut), 'flushed') !== true) {
                                    Webiny.info('Nothing to flush (either OpCache is disabled or the cache is empty).');
                                    Webiny.log(res.stderr);
                                }

                                Webiny.success('Done! Release ' + chalk.magenta(answers.release) + ' is now active!');
                                resolve();
                            });
                        });
                    });
                });
            } catch (e) {
                Webiny.failure(e.message);
                resolve();
            }
        });
    }

    flushCache(config) {
        let basicAuth = '';
        if (config.basicAuth && config.basicAuth.length > 0) {
            const credentials = config.basicAuth.split(':');
            basicAuth = ' --user ' + credentials[0] + ' --password ' + (credentials[1] || '');
        }
        return 'wget ' + basicAuth + ' --no-check-certificate -qO- ' + config.website + '/__clear-cache__';
    };
}

module.exports = Revert;