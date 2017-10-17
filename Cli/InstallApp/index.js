const Webiny = require('webiny-cli/lib/webiny');
const Plugin = require('webiny-cli/lib/plugin');
const _ = require('lodash');

class InstallApp extends Plugin {
    constructor(program) {
        super(program);

        Webiny.on('install-app', ({res, data}) => {
            res.writeHead(200, {
                'Connection': 'keep-alive',
                'Content-Type': 'application/json; charset=utf-8',
                'Transfer-Encoding': 'chunked'
            });

            const log = data => {
                if (_.isString(data)) {
                    data = {message: data};
                }
                !res.finished && res.write(JSON.stringify(data) + '_-_');
            };

            // Install app
            return Webiny.runTask('install-app', {appData: data, log}, {api: true})
                .then(() => {
                    // Add new app to the build
                    Webiny.loadApps();
                    const newApps = Webiny.getApps().filter(a => a.getAppName() === data.localName).map(a => a.getName());

                    log(' ');
                    log('-------');
                    log('Don\'t worry when you see your CSS gone and requests begin to fail.');
                    log('As soon as your new app is built - everything will get back to normal :)');
                    log('-------');
                    log(' ');
                    log('Adding new app to your development build...');
                    log('Rebuilding apps, please wait...');
                    log(' ');

                    // Rebuild apps
                    let lastProgress = 0; // Track last progress update so we don't send same progress again
                    return this.rebuild(newApps, progress => {
                        const percentage = (Math.round(progress * 100) * 100 / 100);

                        if (lastProgress === percentage) {
                            return;
                        }
                        lastProgress = percentage;
                        log({progress: percentage});
                    }, () => {
                        !res.finished && res.end();
                    });
                });
        });
    }

    runTask({appData, log}) {
        if (!log) {
            log = _.noop;
        }

        // Run composer
        log(`Installing ${appData.name}...`);
        log(`Running composer...`);

        // Execute command
        return this.command(`composer require ${appData.packagist}:${appData.version} 2>&1`, log).then(cmdRes => {
            if (cmdRes.error) {
                throw Error(cmdRes.error);
            }

            // Enable app
            const yaml = require('js-yaml');
            const appsYaml = 'Configs/Base/Apps.yaml';
            const configPath = Webiny.projectRoot(appsYaml);
            log(`Enabling app in ${appsYaml}...`);
            let config = yaml.safeLoad(Webiny.readFile(configPath));
            config.Apps[appData.localName] = true;
            Webiny.writeFile(configPath, yaml.safeDump(config, {indent: 4}));
        }).then(() => {
            log('Installing roles, permissions and DB indexes...');
            const params = [
                'php',
                'Apps/Webiny/Php/Cli/install.php',
                'Local',
                appData.localName
            ];
            return this.command(params.join(' '), log).then(cmdRes => {
                if (cmdRes.error) {
                    throw Error(cmdRes.error);
                }
            }).then(() => {
                if (!Webiny.fileExists(`Apps/${appData.localName}/package.json`)) {
                    return;
                }
                log('Installing JS dependencies...');
                const params = [
                    `cd Apps/${appData.localName}`,
                    `yarn install`,
                    `cd ${Webiny.projectRoot()}`
                ];
                return this.command(params.join(' && '), log).then(cmdRes => {
                    if (cmdRes.error) {
                        throw Error(cmdRes.error);
                    }
                });
            });
        }).catch(err => {
            log(' ');
            log({error: err.message});
        });
    }

    rebuild(newApps, progress, finished) {
        Webiny.info("\nRestarting development build...");
        return Webiny.dispatch('develop.stop', {menu: false}).then(() => {
            const apps = (Webiny.getConfig().lastRun.apps || []).concat(newApps);
            return Webiny.runTask('develop', {
                apps: Webiny.getApps().filter(app => apps.includes(app.getName())),
                progressCallback: progress,
                webpackCallback: finished
            }, {api: true});
        });
    }

    command(cmd, onData) {
        const {exec} = require('child_process');
        return new Promise(resolve => {
            const proc = exec(cmd, (error, stdout, stderr) => {
                resolve({error, stdout, stderr});
            });
            proc.stdout.on('data', data => onData(data));
        });
    }
}

InstallApp.task = 'install-app';

module.exports = InstallApp;