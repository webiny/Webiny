import Webiny from 'Webiny';

let initialized = false;

// Find Webiny app element and mount the app
function runWebiny() {
    const config = WebinyBootstrap.config;
    const appElement = document.querySelector('webiny-app');
    const appName = config.app;
    const authenticationApp = config.authentication || 'Core.Backend';

    // Configure Router
    if (config.router) {
        Webiny.Router.setBaseUrl(config.router.baseUrl || '/');
        Webiny.Router.setTitlePattern(config.router.title || '');
        Webiny.Router.setDefaultRoute(config.router.defaultRoute || null);
    }

    // Include required apps
    let boot = Q();
    _.each(config.require || [], depName => {
        boot = WebinyBootstrap.includeApp(depName, true);
    });

    return boot.then(() => {
        return WebinyBootstrap.includeApp(appName).then(app => {
            // Filter modules
            const modules = app.config.modules;
            if (app.config.name !== authenticationApp) {
                delete modules['Authentication'];
            }
            app.instance.meta = app.config;
            app.instance.addModules(modules);
            _.set(Webiny.Apps, app.config.name, app.instance);
            return app.instance.run(appElement);
        });
    });
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

class WebinyBootstrapClass {

    constructor() {
        this.meta = {};
    }

    import(path) {
        return System.import(path).catch(e => console.error(e));
    }

    run(config) {
        if (initialized) {
            return;
        }

        initialized = true;
        this.config = config;
        this.env = window.WebinyEnvironment;
        window._apiUrl = '/api';
        if (this.env === 'development') {
            window.$Webiny = Webiny;
        }

        console.groupCollapsed('Bootstrap');
        // First we need to import Core/Webiny
        return this.includeApp('Core.Webiny').then(app => {
            app.instance.meta = app.config;
            _.set(Webiny.Apps, app.config.name, app.instance);
            return app.instance.addModules(this.meta['Core.Webiny'].modules).run().then(() => {
                return runWebiny().then(() => {
                    console.groupEnd('Bootstrap');
                    return Webiny;
                });
            });
        });
    }

    loadAssets(meta) {
        const assets = [];
        _.each(_.get(meta.assets, 'js', []), item => {
            const vendors = new RegExp('\/vendors([-0-9a-z]+)?.js');
            // Do NOT import Core.Webiny vendors.js
            if (meta.name === 'Core.Webiny' && vendors.test(item)) {
                return;
            }


            if (vendors.test(item)) {
                this.includeScript(item);
                return;
            }

            assets.push(this.import(item));
        });

        const vendors = new RegExp('\/vendors([-0-9a-z]+)?.css');
        _.each(_.get(meta.assets, 'css', []), item => {
            // Do NOT import Core.Webiny vendors.css
            if (meta.name === 'Core.Webiny' && vendors.test(item)) {
                return;
            }
            this.includeCss(item);
        });

        return Q.all(assets).then(() => {
            return this.import(meta.name).then(m => {
                return {
                    instance: m.default,
                    config: meta
                };
            });
        });
    }

    /**
     * Include app
     * @param appName
     * @param object|boolean meta If true, will load modules and run the app
     * @returns {*}
     */
    includeApp(appName, meta) {
        if (!meta || meta === true) {
            const config = {
                url: _apiUrl + '/services/core/apps/' + appName,
                dataType: 'json',
                contentType: 'application/json;charset=UTF-8',
                processData: false
            };
            return request(config).then(res => {
                this.meta[appName] = res.data.data;
                return this.loadAssets(this.meta[appName]).then(app => {
                    if (meta === true) {
                        app.instance.addModules(app.config.modules);
                        _.set(Webiny.Apps, app.config.name, app.instance);
                        return app.instance.run();
                    }
                    return app;
                });
            });
        }
        this.meta[appName] = meta;
        return this.loadAssets(meta);
    }

    includeCss(filename) {
        const file = document.createElement('link');
        file.rel = 'stylesheet';
        file.type = 'text/css';
        file.href = filename;

        if (typeof file !== 'undefined') {
            document.getElementsByTagName('head')[0].appendChild(file);
        }
    }

    includeScript(filename) {
        const file = document.createElement('script');
        file.setAttribute('src', filename);
        document.head.appendChild(file);
    }
}

export default WebinyBootstrapClass;
