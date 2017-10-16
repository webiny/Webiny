const _ = require('lodash');
const Webiny = require('webiny-cli/lib/webiny');
const Plugin = require('webiny-cli/lib/plugin');
const Menu = require('webiny-cli/lib/menu');

class Develop extends Plugin {
    constructor(program) {
        super(program);

        const command = program.command('develop');
        command.description('Build and watch apps for changes.');
        this.addAppOptions(command);
        command.action(cmd => {
            const config = _.assign({}, cmd.parent.opts(), cmd.opts());
            Webiny.runTask('develop', config);
        }).on('--help', () => {
            console.log();
            console.log('  Examples:');
            console.log();
            console.log('    $ webiny-cli develop -a Webiny.Core -a Webiny.Ui -a Webiny.Skeleton');
            console.log('    $ webiny-cli develop --all');
            console.log();
        });

        this.registerEventListeners();
    }

    registerEventListeners() {
        Webiny.on('develop', ({res, data}) => {
            const httpWrite = data => {
                if (_.isString(data)) {
                    data = {message: data};
                }
                res.write(JSON.stringify(data) + '_-_');
            };

            if (!res.headersSent) {
                res.writeHead(200, {
                    'Connection': 'keep-alive',
                    'Content-Type': 'application/json; charset=utf-8',
                    'Transfer-Encoding': 'chunked'
                });
            }

            let lastProgress = 0;
            Webiny.dispatch('develop.stop', {menu: false}).then(() => {
                Webiny.runTask('develop', {
                    app: data.app,
                    all: !data.app,
                    progressCallback: progress => {
                        const percentage = (Math.round(progress * 100) * 100 / 100);

                        if (lastProgress !== percentage) {
                            lastProgress = percentage;
                            !res.finished && httpWrite({progress: percentage});
                        }
                    },
                    webpackCallback: () => {
                        // At the moment, we are not sending anything back. Just end the request to signal success.
                        !res.finished && res.end();
                    }
                }, {api: true});
            });
        });
    }

    getMenu() {
        return new Menu('Develop! (watches for file changes and rebuilds apps for you)').addLineBefore();
    }

    runTask(config) {
        const Task = require('./task');
        process.env.NODE_ENV = 'development';
        const task = new Task(config);
        return task.run();
    }
}

Develop.task = 'develop';

module.exports = Develop;