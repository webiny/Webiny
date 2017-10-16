const Webiny = require('webiny-cli/lib/webiny');
const Plugin = require('webiny-cli/lib/plugin');

class Api extends Plugin {
    constructor(program) {
        super(program);

        this.selectApps = false;

        const _ = require('lodash');
        const express = require('express');
        const port = _.get(Webiny.getConfig(), 'cli.port', 3000);

        const app = express();
        app.use((req, res, next) => {
            const url = require('url').parse(req.url, true);
            const data = url.query;

            // Make sure apps is an array
            if(data.apps && _.isString(data.apps)) {
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