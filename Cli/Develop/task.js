require('console-stamp')(console, 'HH:MM:ss.l');

// We need this to override some webpack classes (did not have time to tinker with pull requests, etc.)
const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function () {
    // Override MultiCompiler to force chained builds instead of parallel
    if (arguments[0].includes('MultiCompiler')) {
        return originalRequire.apply(this, [__dirname + '/MultiCompiler']);
    }
    return originalRequire.apply(this, arguments);
};

const path = require('path');
const webpack = require('webpack');
const _ = require('lodash');
const fs = require('fs-extra');
const browserSync = require('browser-sync');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const WriteFilePlugin = require('write-file-webpack-plugin');
const Webiny = require('webiny/lib/webiny');
const Build = require('./../Build/task');

class Develop extends Build {

    constructor(config) {
        super(config);
        this.port = _.get(Webiny.getConfig(), 'browserSync.port', 3000);
        this.domain = _.get(Webiny.getConfig(), 'browserSync.domain', 'http://localhost');
    }

    run() {
        const vendorConfigs = this.getVendorConfigs();

        Webiny.log('--------------------------------------------------------------------------');
        Webiny.info('Please be patient, the initial webpack build may take a few moments...');
        Webiny.log('--------------------------------------------------------------------------');

        // Remove all files from build folder
        this.config.apps.map(app => {
            fs.emptyDirSync(Webiny.projectRoot('public_html') + '/build/' + process.env.NODE_ENV + '/' + app.getPath());
        });

        if (vendorConfigs) {
            return this.buildConfigs(vendorConfigs).then(() => {
                const appConfigs = this.getAppConfigs();
                this.buildAndWatch(appConfigs);
            });
        }

        const appConfigs = this.getAppConfigs();
        return this.buildAndWatch(appConfigs);
    }

    buildAndWatch(configs) {
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
        let publicPath = this.domain + '/build/development/';
        if (configs.length === 1) {
            publicPath = this.domain + '/build/development/' + configs[0].name.replace('.', '_') + '/';
        }
        // Run browser-sync server
        const bsConfig = {
            ui: false,
            open: false,
            port: this.port,
            socket: {
                domain: this.domain + ':' + this.port
            },
            server: {
                baseDir: Webiny.projectRoot('public_html'),
                middleware: [
                    (req, res, next) => {
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        next();
                    },
                    devMiddleware(compiler, {
                        publicPath,
                        noInfo: false,
                        stats: false,
                        /*stats: {
                            colors: true
                        }*/
                    }),
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

        browserSync(bsConfig);
    }
}

module.exports = Develop;