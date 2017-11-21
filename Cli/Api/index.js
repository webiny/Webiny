const Webiny = require('webiny-cli/lib/webiny');
const Plugin = require('webiny-cli/lib/plugin');
const _ = require('lodash');

class Api extends Plugin {
    constructor(program) {
        super(program);
        this.currentTask = [];
        this.taskLog = [];
        
        // Attach listeners and run server only if webiny-cli was run without arguments
        if (process.argv.length <= 2) {
            Webiny.on('beforeTask', ({task}) => {
                this.currentTask.push(task);
                this.taskLog.push({status: 'started', task, ts: Date.now()});
            });

            Webiny.on('afterTask', ({task, data, err}) => {
                this.currentTask.splice(this.currentTask.indexOf(task), 1);
                const ts = Date.now();
                const log = _.findLastIndex(this.taskLog, l => l.task === task);
                const duration = (ts - this.taskLog[log].ts) / 1000;

                this.taskLog.push({status: 'finished', ts, duration, task, data, err});
            });

            this.runHttpServer();
        }
    }

    runHttpServer() {
        const wConfig = Webiny.getConfig();
        const _ = require('lodash');
        const express = require('express');
        const port = _.get(wConfig, 'cli.port', 3000);

        const app = express();
        app.get('/status', (req, res) => {
            res.json({
                uptime: (Date.now() - this.apiStarted) / 1000,
                environment: wConfig.cli.environment,
                host: wConfig.cli.host,
                cwd: Webiny.projectRoot(),
                state: this.currentTask.length ? 'working' : 'idle',
                task: this.currentTask,
                log: this.taskLog
            });
        });

        app.use((req, res, next) => {
            const url = require('url').parse(req.url, true);
            const data = url.query;

            // Make sure apps is an array
            if (data.apps && _.isString(data.apps)) {
                data.apps = [data.apps];
            }

            // Process request
            if (!data || !data.action) {
                Webiny.dispatch('api.middleware', {req, res, next});
            } else {
                Webiny.dispatch(data.action, {req, res, data}).then(() => {
                    try {
                        !res.finished && !res.headersSent && res.end();
                    } catch (e) {
                        console.error(e);
                    }
                });
            }
        });

        const server = app.listen(port, (err) => {
            if (err) {
                console.log(err);
            }
            this.apiStarted = Date.now();
        });

        process.on('uncaughtException', function (err) {
            if (err && err.code === 'EADDRINUSE') {
                Webiny.log(`\n`);
                Webiny.warning(`We are unable to spawn our CLI API server using port ${port}.`);
                Webiny.log(`\nThe following process is already using it:`);
                const output = Webiny.shellExecute(`lsof -i:${port} | grep "LISTEN"`, {stdio: 'pipe'}).toString();
                Webiny.info(output);
                Webiny.log(`If you think it's a mistake, kill the process manually and restart the webiny-cli.`);
            } else {
                console.log(err);
            }
        });

        process.on('SIGTERM', function () {
            server && server.close(() => {
                process.exit(0);
            });
        });
    }
}

Api.task = 'api';

module.exports = Api;