import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import $ from 'jquery';
import 'babel-polyfill';
import Page from './Lib/Core/Page';

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

class Webiny {
    constructor() {
        this.Apps = {};
        this.Config = {};
        this.EMPTY = '__webiny_empty__';
        this.Page = new Page();

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
            // Configure Router
            if (config.router) {
                this.Router.setBaseUrl(config.router.baseUrl || '/');
                this.Router.setTitlePattern(config.router.title || '');
                this.Router.setDefaultRoute(config.router.defaultRoute || null);
                this.Router.setHistory(config.router.history);
            }

            return this.loadBundle(coreConfig).then(() => this.Apps.Webiny.Core.run());
        }).then(() => {
            // Load and run apps
            let loader = Promise.resolve();
            config.apps.map(name => {
                loader = loader.then(() => {
                    return this.includeApp(name, this.Config.Meta[name] || null).then(app => app.run());
                });
            });
            return loader;
        }).then(() => {
            // Initialize Authentication (if registered by one of the apps)
            config.apps.map(name => {
                if (name === config.auth) {
                    this.Auth = _.get(this.Apps, name).getAuth();
                }
            });

            if (this.Auth) {
                this.Auth.init();
            }

            // Mount RootElement
            const RootElement = this.RootElement;
            this.app = ReactDOM.render(<RootElement/>, document.querySelector('webiny-app'));
        });
    }

    registerApp(app) {
        _.set(this.Apps, app.name, app);
        return this;
    }

    registerModule(...modules) {
        modules.map(m => this.ModuleLoader.setModule(m));
        return this;
    }

    configureModule(name, config) {
        this.ModuleLoader.setConfiguration(name, config);
    }

    includeApp(name, config) {
        const runApp = (appConfig) => {
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
            loader = loader.then(() => this.loadBundle(appConfig));

            return loader;
        };

        console.time(name);
        let loadConfig = Promise.resolve(config);

        if (!config) {
            const config = {
                url: this.Config.WebPath + '/build/' + this.Config.Environment + '/' + name.replace('.', '_') + '/meta.json',
                dataType: 'json',
                contentType: 'application/json;charset=UTF-8',
                processData: false
            };

            loadConfig = request(config).then(res => res.data);
        }

        return loadConfig.then(config => {
            // Set config to meta to have chunks map ready for webpack
            this.Config.Meta[name] = config;
            return runApp(config);
        }).then(() => {
            return _.get(this.Apps, name);
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
        if (!element || !React.isValidElement(element) || _.isString(element.type)) {
            return false;
        }

        // If a class to compare against has an "__originalComponent" property it means it's a ComponentWrapper
        // Need to compare against originalComponent class
        let targetType = type;
        if (type.hasOwnProperty('__originalComponent')) {
            targetType = type.__originalComponent;
        }

        // If the element type has an "__originalComponent" property it means it's a ComponentWrapper
        // Need to compare against originalComponent class
        let elementType = element.type;
        if (elementType.hasOwnProperty('__originalComponent')) {
            elementType = elementType.__originalComponent;
        }

        // Check if targetType can be found in the inheritance tree with possible ComponentWrapper being an intermediate class
        const checkDeeper = (elementType) => {
            if (!elementType) {
                return false;
            }

            if (elementType === targetType || elementType.prototype instanceof targetType) {
                return true;
            }

            return checkDeeper(Object.getPrototypeOf(elementType.prototype).constructor.__originalComponent);
        };

        if (elementType === targetType || elementType.prototype instanceof targetType) {
            return true;
        }

        try {
            return checkDeeper(Object.getPrototypeOf(elementType.prototype).constructor.__originalComponent);
        } catch (e) {
            return false;
        }
    }

    setModuleLoader(loader) {
        this.ModuleLoader = loader;
    }
}

export default new Webiny();