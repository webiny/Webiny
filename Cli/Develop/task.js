// We need this to override some webpack classes (did not have time to tinker with pull requests, etc.)
const path = require('path');
const webpack = require('webpack');
const _ = require('lodash');
const fs = require('fs-extra');
const browserSync = require('browser-sync').create();
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const WriteFilePlugin = require('write-file-webpack-plugin');
const Webiny = require('webiny-cli/lib/webiny');
const Build = require('./../Build/task');

// Override logger callbacks - we do not need the default output
const Logger = require('browser-sync/lib/logger');
Logger.callbacks['service:running'] = _.noop;
Logger.callbacks['file:watching'] = _.noop;

let devMiddlewareInstance = null;

class Develop extends Build {

    constructor(config) {
        super(config);
        this.domain = _.get(Webiny.getConfig(), 'cli.domain', 'http://localhost') + ':' + _.get(Webiny.getConfig(), 'cli.port', 3000);
        this.webpackCallback = config.webpackCallback || null;
        this.progressCallback = config.progressCallback || null;
    }

    run() {
        const vendorConfigs = this.getVendorConfigs();

        const msg = 'Please be patient, the initial webpack build may take a few moments...';
        const line = new Array(msg.length + 3).join('-');
        Webiny.log("\n" + line);
        Webiny.info(msg);
        Webiny.log(line);

        // Remove all files from build folder
        this.config.apps.map(app => {
            try {
                fs.emptyDirSync(Webiny.projectRoot('public_html') + '/build/development/' + app.getPath());
            } catch (e) {
                // Ignore
            }
        });

        const statsConfig = {
            all: false,
            errors: true,
            moduleTrace: true,
            colors: true
        };

        if (vendorConfigs.length) {
            Webiny.info('Building vendors...');
            return this.buildConfigs(vendorConfigs, false).then(stats => {
                stats.toJson().children.map(s => {
                    Webiny.log(`webpack built ${s.name} vendors ${s.hash} in ${s.time} ms`);
                });
                const appConfigs = this.getAppConfigs();
                return Webiny.dispatch('before-webpack', {configs: appConfigs}).then(() => {
                    return this.buildAndWatch(appConfigs, statsConfig);
                });
            });
        }

        const appConfigs = this.getAppConfigs();
        return Webiny.dispatch('before-webpack', {configs: appConfigs}).then(() => {
            return this.buildAndWatch(appConfigs, statsConfig);
        });
    }

    buildAndWatch(configs, statsConfig) {
        // Write webpack files to disk to trigger BrowserSync injection on CSS
        const wfp = {log: false, test: /^((?!hot-update).)*$/};
        configs.map(config => {
            config.devServer = {outputPath: config.output.path};
            config.plugins.push(new WriteFilePlugin(wfp));
        });

        // Create webpack compiler
        // If we are only building one app we MUST NOT pass an array!!
        // An array causes webpack to treat it as MultiCompiler and it resolves hot update file paths incorrectly thus breaking hot reload
        const compiler = webpack(configs);

        if (this.progressCallback) {
            compiler.apply(new webpack.ProgressPlugin(this.progressCallback));
        }

        let publicPath = this.domain + '/build/development/';
        if (configs.length === 1) {
            publicPath = this.domain + '/build/development/' + configs[0].name.replace('.', '_') + '/';
        }

        // If there is an existing instance of dev-middleware running, we need to stop it.
        if (devMiddlewareInstance) {
            devMiddlewareInstance.close();
        }

        const devMiddlewareOptions = {
            publicPath,
            noInfo: false,
            stats: statsConfig
        };

        const key = 'cli.plugins.develop.devMiddleware';
        _.merge(devMiddlewareOptions, _.get(Webiny.getConfig(), key, {}));

        devMiddlewareInstance = devMiddleware(compiler, devMiddlewareOptions);

        if (this.webpackCallback) {
            devMiddlewareInstance.waitUntilValid(this.webpackCallback);
        }

        // Run browser-sync server
        const bsConfig = {
            ui: false,
            open: false,
            logPrefix: 'Webiny',
            online: false,
            socket: {
                domain: this.domain
            },
            server: {
                baseDir: Webiny.projectRoot('public_html'),
                middleware: [
                    (req, res, next) => {
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        next();
                    },
                    devMiddlewareInstance,
                    hotMiddleware(compiler)
                ]
            },
            watchOptions: {
                ignoreInitial: true,
                ignored: '*.{html,js,json}'
            },
            // Files being watched for changes (add CSS of apps selected for build)
            files: configs.map(c => {
                return c.output.path + '/*.css'
            })
        };

        // Return a promise which never resolves. It will keep the task running until you abort the process.
        return new Promise((resolve) => {
            Webiny.info('Building apps...');
            let removeMiddleware;
            browserSync.init(bsConfig, (err, bs) => {
                let off = Webiny.on('develop.stop', ({res, menu}) => {
                    removeMiddleware();
                    browserSync.exit();
                    // Remove `develop.stop` event listener
                    off();
                    return new Promise(timeoutResolve => {
                        setTimeout(() => {
                            res && res.end();
                            resolve({menu});
                            timeoutResolve();
                        }, 1000);
                    });
                });

                const proxy = require('http-proxy-middleware');
                const middleware = proxy('/', {
                    logLevel: 'silent',
                    target: 'http://localhost:' + bs.options.get('port'),
                    changeOrigin: true,
                    ws: true
                });

                removeMiddleware = Webiny.on('api.middleware', ({req, res}) => {
                    return new Promise(resolve => {
                        res.on('end', resolve);
                        middleware(req, res, resolve);
                    });
                });
            });
        });
    }
}

module.exports = Develop;