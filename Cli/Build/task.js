const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const _ = require('lodash');
const yaml = require('js-yaml');
const Webiny = require('webiny-cli/lib/webiny');
const Bundler = require('./bundler');

class Build {
    constructor(config) {
        this.config = config;
        this.baseAppConfig = require('./webpack/app')();
        this.baseVendorConfig = require('./webpack/vendor');

        if (process.env.NODE_ENV === 'production') {
            const appConfig = yaml.load(Webiny.readFile(Webiny.projectRoot('Configs/' + this.config.configSet + '/Application.yaml')));
            this.config.assetRules = _.get(appConfig, 'Application.AssetRules', []);
        }
    }

    run() {
        const vendorConfigs = this.getVendorConfigs();

        Webiny.log('--------------------------------------------------------------------------');
        Webiny.info('Please be patient, the production build may take a while...');
        Webiny.log('--------------------------------------------------------------------------');

        // Remove all files from build folder
        this.config.apps.map(app => {
            fs.emptyDirSync(Webiny.projectRoot('public_html') + '/build/' + process.env.NODE_ENV + '/' + app.getPath());
        });

        return this.buildConfigs(vendorConfigs).then(() => {
            const appConfigs = this.getAppConfigs();
            return this.buildConfigs(appConfigs).then(stats => {
                return new Bundler(stats, {assetRules: this.config.assetRules}).bundle().then(() => stats);
            });
        });
    }

    buildConfigs(configs, statsConfig = {colors: true}) {
        return new Promise((resolve, reject) => {
            webpack(configs).run(function (err, stats) {
                if (err) reject(err);

                if (statsConfig) {
                    console.log(stats.toString(statsConfig));
                }
                resolve(stats);
            });
        });
    }

    getAppConfigs() {
        const appConfigs = [];
        this.config.apps.map(app => {
            // Create a base config which can be used without modification
            let appConfig = this.baseAppConfig(app, this.config);
            // Check if the app has a webpack app config defined
            const appCfgPath = Webiny.projectRoot(app.getSourceDir() + '/webpack.app.js');
            if (Webiny.fileExists(appCfgPath)) {
                // Import app config and pass the base app config for modification
                appConfig = require(appCfgPath)(appConfig, app);
            }

            appConfigs.push(appConfig);
        });

        return appConfigs.length > 0 ? appConfigs : null;
    }

    getVendorConfigs() {
        const vendorConfigs = [];
        this.config.apps.map(app => {
            // Check if the app has a webpack vendor config defined
            const vendorCfgPath = Webiny.projectRoot(app.getSourceDir() + '/webpack.vendor.js');
            if (Webiny.fileExists(vendorCfgPath)) {
                const baseConfig = this.baseVendorConfig(app);
                const vendorConfig = require(vendorCfgPath)(baseConfig);
                const entry = vendorConfig['entry'];
                if ((_.isArray(entry) && entry.length > 0) || _.isPlainObject(entry) && Object.keys(entry).length > 0) {
                    vendorConfigs.push(vendorConfig);
                }
            }
        });
        return vendorConfigs;
    }
}

module.exports = Build;