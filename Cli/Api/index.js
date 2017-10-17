const Webiny = require('webiny-cli/lib/webiny');
const Plugin = require('webiny-cli/lib/plugin');
const _ = require('lodash');

class Api extends Plugin {
    constructor(program) {
        super(program);
        this.currentTask = [];
        this.taskLog = [];

        // Attach listeners and run server only if webiny-cli was run without arguments
        if (program.args.length === 0) {
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
            res.end(JSON.stringify({
                uptime: (Date.now() - this.apiStarted) / 1000,
                env: wConfig.env,
                cwd: Webiny.projectRoot(),
                state: this.currentTask.length ? 'working' : 'idle',
                task: this.currentTask,
                log: this.taskLog
            }));
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
            this.apiStarted = Date.now();
            if (err) {
                console.log(err);
            }
        });

        process.on('uncaughtException', function (exception) {
            console.log(exception);
        });

        process.on('SIGTERM', function () {
            server.close(() => {
                process.exit(0);
            });
        });
    }
}

Api.task = 'api';

module.exports = Api;