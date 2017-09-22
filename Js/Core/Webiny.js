import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import $ from 'jquery';
import 'babel-polyfill';
import Page from './Lib/Core/Page';
import isElementOfType from './Lib/isElementOfType';

class Webiny {
    constructor() {
        this.Apps = {};
        this.Config = {};
        this.EMPTY = '__webiny_empty__';
        this.Page = new Page();
        this.onRenderCallbacks = [];
        this.firstRenderDone = false;

        if (DEVELOPMENT) {
            this.hotReloading = false;
            this.isHotReloading = () => this.hotReloading;
            this.refresh = () => {
                this.hotReloading = true;
                this.app.setState({ts: new Date().getTime()}, () => {
                    this.hotReloading = false;
                });
            }
        }
    }

    import(modules, options = {}) {
        return this.ModuleLoader.load(modules, options);
    }

    importByTag(tag) {
        return this.ModuleLoader.loadByTag(tag);
    }

    run(config) {
        this.Config = config;
        console.timeStamp("Webiny Run");
        const coreConfig = config.Meta['Webiny.Core'];
        return this.Page.loadScript(coreConfig.app).then(() => {
            return this.loadBundle(coreConfig).then(() => this.Apps['Webiny.Core'].run());
        }).then(() => {
            // Load and run apps
            let loader = Promise.resolve();
            config.apps.map(name => {
                loader = loader.then(() => this.includeApp(this.Config.Meta[name]).then(app => app.run()));
            });
            return loader;
        }).then(() => {
            if (this.Auth) {
                this.Auth.init();
            }

            // Mount RootElement
            const onDidUpdate = () => {
                this.firstRenderDone = true;
                this.onRenderCallbacks.map(cb => cb());
            };
            this.app = ReactDOM.render(React.createElement(this.Ui.RootElement, {onDidUpdate}), document.querySelector('webiny-app'));
        });
    }

    registerApp(app) {
        this.Apps[app.name] = app;
        return this;
    }

    registerModule(...modules) {
        modules.map(m => this.ModuleLoader.setModule(m));
        return this;
    }

    configureModule(name, config) {
        this.ModuleLoader.setConfiguration(name, config);
    }

    includeApp(config) {
        let loadConfig = null;

        // Config object is immediately assigned to loadConfig as a promise
        if (_.isPlainObject(config)) {
            loadConfig = Promise.resolve(config);
        }

        // Check if requested app meta is already present
        if (_.isString(config) && _.has(this.Config.Meta, config)) {
            loadConfig = Promise.resolve(this.Config.Meta[config]);
        }

        // If we still do not have our config - load app meta from server
        if (_.isString(config) && _.isNull(loadConfig)) {
            const load = {
                url: this.Config.WebUrl + '/build/' + this.Config.Environment + '/' + config.replace('.', '_') + '/meta.json',
                dataType: 'json',
                contentType: 'application/json;charset=UTF-8',
                processData: false
            };

            loadConfig = request(load).then(res => res.data);
        }

        return loadConfig.then(config => {
            // Set config to meta to have chunks map ready for webpack
            this.Config.Meta[config.name] = config;
            return prepareApp.call(this, config).then(() => this.Apps[config.name]);
        });
    }

    loadBundle(config) {
        let load = [];
        if (_.isPlainObject(config.bundles)) {
            _.each(config.bundles, (bundleUrl, routerUrl) => {
                if (routerUrl === '*') {
                    load.push(this.Page.loadScript(bundleUrl));
                    return;
                }

                const regex = new RegExp(routerUrl);
                if (regex.test(this.Router.history.location.pathname)) {
                    load.push(this.Page.loadScript(bundleUrl));
                }
            });
        }

        return Promise.all(load);
    }

    /**
     * Check if given element's class has the given flag defined in its options
     *
     * @param element
     * @param flag
     */
    elementHasFlag(element, flag) {
        if (React.isValidElement(element)) {
            return _.get(element.type, 'options.' + flag, false);
        }

        return false;
    }

    isElementOfType(element, type) {
        return isElementOfType(element, type);
    }

    setModuleLoader(loader) {
        this.ModuleLoader = loader;
    }
}

function formatAjaxResponse(jqXhr) {
    return {
        data: jqXhr.responseJSON,
        status: jqXhr.status,
        statusText: jqXhr.statusText
    };
}

function request(config) {
    return new Promise(resolve => {
        $.ajax(config)
            .done((data, textStatus, jqXhr) => {
                resolve(formatAjaxResponse(jqXhr));
            })
            .fail(jqXhr => {
                resolve(formatAjaxResponse(jqXhr));
            });
    });
}

function prepareApp(appConfig) {
    let loader = Promise.resolve();
    if (_.has(appConfig, 'vendor')) {
        loader = loader.then(() => this.Page.loadScript(appConfig['vendor']));
    }

    if (_.has(appConfig, 'app')) {
        loader = loader.then(() => this.Page.loadScript(appConfig['app']));
    }

    if (_.has(appConfig, 'css')) {
        this.Page.loadStylesheet(appConfig['css']);
    }

    // Load extra bundle if route matches
    return loader.then(() => this.loadBundle(appConfig));
}

export default new Webiny();