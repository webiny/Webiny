const Page = require('./Lib/Core/Page');

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
        this.EMPTY = '__webiny_empty__';
        this.Page = new Page();
        this.ModuleLoader = null;
        this.Ui = {
            Components: {}
        };

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

    import(modules) {
        return this.ModuleLoader.load(modules);
    }

    run(config) {
        this.Page.loadStylesheet(webinyMeta['Core.Webiny'].css);
        return this.Page.loadScript(webinyMeta['Core.Webiny'].app).then(() => {
            // Configure Core
            if (config.router) {
                this.Router.setBaseUrl(config.router.baseUrl || '/');
                this.Router.setTitlePattern(config.router.title || '');
                this.Router.setDefaultRoute(config.router.defaultRoute || null);
            }

            let loader = Promise.resolve();
            config.apps.map(name => {
                loader = loader.then(() => {
                    return this.includeApp(name, webinyMeta[name] || null).then(app => app.run());
                });
            });
            return loader;
        }).then(() => {
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

    registerModule(name, provider) {
        if (_.isPlainObject(name)) {
            _.each(name, (provider, name) => this.ModuleLoader.setModule(name, provider));
        } else {
            this.ModuleLoader.setModule(name, provider);
        }
    }

    configure(name, config) {
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

            return loader;
        };

        let loadConfig = Promise.resolve(config);

        if (!config) {
            const config = {
                url: webinyWebPath + '/build/' + webinyEnvironment + '/' + name.replace('.', '_') + '/meta.json',
                dataType: 'json',
                contentType: 'application/json;charset=UTF-8',
                processData: false
            };

            loadConfig = request(config).then(res => res.data);
        }

        return loadConfig.then(runApp).then(() => {
            return _.get(this.Apps, name);
        });
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
        if (!React.isValidElement(element) || _.isString(element.type)) {
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

module.exports = new Webiny;