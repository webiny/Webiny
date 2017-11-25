const path = require('path');
const chalk = require('chalk');
const SshClient = require('node-sshclient');
const _ = require('lodash');
const Webiny = require('webiny-cli/lib/webiny');

class Deploy {
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

        const file = path.parse(config.archive);

        return new Promise((resolve, reject) => {
            const sshConfig = {
                hostname: domain,
                user: user,
                port: parseInt(port)
            };

            try {
                const ssh = new SshClient.SSH(sshConfig);
                Webiny.info('\nVerifying folder structure on remote server...');
                const structure = `mkdir -p ${rootFolder}/{files,releases,logs,active}`;
                ssh.command(structure, () => {
                    Webiny.info('Uploading release archive to remote server...');
                    const rsync = `rsync --progress -e 'ssh -p ${port}' ${config.archive} ${domain}:${rootFolder}/releases`;
                    Webiny.execSync(rsync);
                    Webiny.success('Done! Release archive uploaded to ' + chalk.magenta(`${rootFolder}/releases/` + file.base));

                    const unzip = [
                        `cd ${rootFolder}/releases`,
                        `rm -rf ${rootFolder}/releases/${file.name}`,
                        `unzip -qu ${file.base} -d ${file.name}`,
                        `rm ${file.base}`
                    ].join(' && ');

                    ssh.command(unzip, () => {
                        Webiny.info('Activating release...');
                        const activate = [
                            `rm -f ${rootFolder}/active/${folder}`,
                            `ln -s ${rootFolder}/releases/${file.name} ${rootFolder}/active/${folder}`,
                            `mkdir -m 0775 -p ${rootFolder}/files/${folder}/{Uploads,Temp}`,
                            `ln -s ${rootFolder}/files/${folder}/Uploads ${rootFolder}/active/${folder}/public_html/uploads`,
                            `ln -s ${rootFolder}/files/${folder}/Temp ${rootFolder}/active/${folder}/Temp`,
                            `mkdir -m 0775 ${rootFolder}/active/${folder}/Cache`
                        ].join(' && ');
                        ssh.command(activate, res => {
                            if (res.stderr) {
                                Webiny.failure('\nRelease activation failed!');
                                console.error(res);
                                return reject();
                            }
                            Webiny.info('Clearing cache for ' + chalk.magenta(config.website) + '...');
                            ssh.command(this.flushCache(config), res => {
                                const commandOut = res.stdout || '{}';
                                if (res.exitCode !== 0 || _.get(JSON.parse(commandOut), 'flushed') !== true) {
                                    Webiny.info('Nothing to flush (either OpCache is disabled or the cache is empty).');
                                    Webiny.log(res.stderr);
                                }

                                Webiny.info('Executing post-deploy scripts...');
                                const postDeploy = [
                                    `cd ${rootFolder}/active/${folder} && php Apps/Webiny/Php/Cli/release.php ${config.website}`
                                ].join(' && ');
                                ssh.command(postDeploy, res => {
                                    Webiny.log(res.stdout);
                                    Webiny.success('Done! Deploy process finished successfully.');
                                    resolve();
                                });
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
module.exports = Deploy;