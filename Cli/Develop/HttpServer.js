const http = require('http');
const qs = require('querystring');
const _ = require('lodash');
const httpUrl = require('url');
const exec = require('child_process').exec;
const Webiny = require('webiny-cli/lib/webiny');

class HttpServer {
    constructor(browserSync, port) {
        this.browserSync = browserSync;
        this.port = parseInt(port);
    }

    run() {
        const httpServer = http.createServer((req, res) => {
            const url = httpUrl.parse(req.url, true);
            let body = '';

            req.on('data', (data) => {
                body += data;
            });

            req.on('end', () => {
                if (req.method === 'POST' && url.query.action === 'install') {
                    const post = qs.parse(body);
                    return this.installApp(req, res, url, post);
                }
                res.end();
            });
        });
        httpServer.on('error', err => Webiny.failure(err));
        httpServer.listen(this.port + 1);
        return httpServer;
    }

    installApp(req, res, url, appData) {
        const docker = Webiny.getConfig().env === 'docker';

        res.writeHead(200, {
            'Connection': 'Transfer-Encoding',
            'Transfer-Encoding': 'chunked'
        });

        const httpWrite = data => {
            if (_.isString(data)) {
                data = {message: data};
            }
            res.write(JSON.stringify(data))
        };

        // Run composer
        httpWrite(`Installing ${appData.name}...`);
        httpWrite(`Running composer...`);

        // Local and docker env have entirely different commands, thus all this garbage
        let composer = `composer require ${appData.packagist}:${appData.version} 2>&1`;
        if (docker) {
            composer = `docker run --rm --volume $PWD:/app composer require ${appData.packagist}:${appData.version} --ignore-platform-reqs --no-scripts 2>&1`;
        }

        // Execute command
        return this.command(composer, httpWrite).then(cmdRes => {
            if (cmdRes.error) {
                throw Error(cmdRes.error);
            }

            // Enable app
            const yaml = require('js-yaml');
            const appsYaml = 'Configs/Base/Apps.yaml';
            const configPath = Webiny.projectRoot(appsYaml);
            httpWrite(`Enabling app in ${appsYaml}...`);
            let config = yaml.safeLoad(Webiny.readFile(configPath));
            config.Apps[appData.localName] = true;
            Webiny.writeFile(configPath, yaml.safeDump(config, {indent: 4}));
        }).then(() => {
            httpWrite('Installing roles, permissions and DB indexes...');
            const params = [
                docker ? 'docker-compose run php php' : 'php',
                'Apps/Webiny/Php/Cli/install.php',
                'Local',
                appData.localName
            ];
            return this.command(params.join(' '), httpWrite).then(cmdRes => {
                if (cmdRes.error) {
                    throw Error(cmdRes.error);
                }
            }).then(() => {
                if (!Webiny.fileExists(`Apps/${appData.localName}/package.json`)) {
                    return;
                }
                httpWrite('Installing JS dependencies...');
                const params = [
                    `cd Apps/${appData.localName}`,
                    `yarn install`,
                    `cd ${Webiny.projectRoot()}`
                ];
                return this.command(params.join(' && '), httpWrite).then(cmdRes => {
                    if (cmdRes.error) {
                        throw Error(cmdRes.error);
                    }
                });
            });
        }).then(() => {
            Webiny.loadApps();
            // Get new JS apps
            const newApps = Webiny.getApps().filter(app => app.getAppName() === appData.localName).map(app => app.getName());

            httpWrite(' ');
            httpWrite('-------');
            httpWrite('Don\'t worry when you see your CSS gone and requests begin to fail.');
            httpWrite('As soon as your new app is built - everything will get back to normal :)');
            httpWrite('-------');
            httpWrite(' ');
            httpWrite('Adding new app to your development build...');
            httpWrite('Rebuilding apps, please wait...');
            httpWrite(' ');

            // Rebuild apps
            let lastProgress = 0; // Track last progress update so we don't send same progress again
            return this.rebuild(newApps, progress => {
                if (lastProgress === progress) {
                    return;
                }

                lastProgress = progress;
                const percentage = (Math.round(progress * 100) * 100 / 100);

                !res.finished && httpWrite({progress: percentage});
            }, () => {
                // At the moment, we are not sending anything back. Just end the request to signal success.
                !res.finished && res.end();
            });
        }).catch(err => {
            httpWrite(' ');
            httpWrite({error: err.message});
            return res.end();
        });
    }

    rebuild(newApps, progress, finished) {
        Webiny.info('Restarting development build...');
        this.browserSync.exit();
        const apps = (Webiny.getConfig().lastRun.apps || []).concat(newApps);
        Webiny.runTask('develop', {
            apps: Webiny.getApps().filter(app => apps.includes(app.getName())),
            progressCallback: progress,
            webpackCallback: finished
        });
    }

    command(cmd, onData) {
        return new Promise(resolve => {
            const proc = exec(cmd, (error, stdout, stderr) => {
                resolve({error, stdout, stderr});
            });
            proc.stdout.on('data', data => onData(data));
        });
    }
}

module.exports = HttpServer;