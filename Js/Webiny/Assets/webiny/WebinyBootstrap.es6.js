import Webiny from 'Webiny';

let initialized = false;

// Find Webiny app element and mount the app
function runWebiny() {
    const config = WebinyBootstrap.config;
    const appElement = document.querySelector('webiny-app');
    const appName = config.app;

    // Configure Router
    if (config.router) {
        Webiny.Router.setBaseUrl(config.router.baseUrl || '/');
        Webiny.Router.setTitlePattern(config.router.title || '');
        Webiny.Router.setDefaultRoute(config.router.defaultRoute || null);
    }

    // Include required apps
    // TODO: remove this - dependencies are now specified through JS
    let boot = Promise.resolve();
    _.each(config.require || [], depName => {
        boot = boot.then(() => WebinyBootstrap.includeApp(depName));
    });

    return boot.then(() => {
        return WebinyBootstrap.includeApp(appName).then(app => {
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
            return Promise.resolve(false);
        }

        initialized = true;
        this.config = config;
        this.env = window.webinyEnvironment;
        if (this.env === 'development') {
            window.$Webiny = Webiny;
        }

        console.groupCollapsed('Bootstrap');
        // First we need to import Core/Webiny
        return this.includeApp('Core.Webiny').then(() => {
            // Include logger
            System.import('Core/Webiny/logger').then(m => {
                _.set(Webiny, 'Logger', new m.default());
            });

            return runWebiny().then(() => {
                console.groupEnd('Bootstrap');
                return Webiny;
            });
        });
    }

    loadScripts(meta) {
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

        return Promise.all(assets).then(() => {
            return this.import(meta.name).then(m => {
                return {
                    instance: m.default,
                    config: meta
                };
            });
        });
    }

    loadCss(app) {
        const meta = app.instance.meta;
        const vendors = new RegExp('\/vendors([-0-9a-z]+)?.css');
        _.each(_.get(meta.assets, 'css', []), item => {
            // Do NOT import Core.Webiny vendors.css
            if (meta.name === 'Core.Webiny' && vendors.test(item)) {
                return;
            }
            this.includeCss(item);
        });
        return app;
    }

    /**
     * Include app
     * @param appName
     * @param meta
     * @param autoRun
     * @returns {*}
     */
    includeApp(appName, meta = null, autoRun = true) {
        if (_.has(webinyMeta, appName) || _.isPlainObject(meta)) {
            this.meta[appName] = _.get(webinyMeta, appName, meta);
            return this.loadScripts(this.meta[appName]).then(app => {
                return this.runApp(app, autoRun).then(() => {
                    return this.loadCss(app);
                });
            });
        }

        const config = {
            url: webinyWebPath + '/build/' + webinyEnvironment + '/' + appName.replace('.', '/') + '/meta.json',
            dataType: 'json',
            contentType: 'application/json;charset=UTF-8',
            processData: false
        };

        return request(config).then(res => {
            this.meta[appName] = res.data;
            return this.loadScripts(this.meta[appName]).then(app => {
                return this.runApp(app, autoRun).then(() => {
                    return this.loadCss(app);
                });
            });
        });
    }

    runApp(app, autoRun = true) {
        let appBoot = Promise.resolve();
        _.each(app.instance.dependencies || [], depName => {
            appBoot = appBoot.then(() => WebinyBootstrap.includeApp(depName));
        });

        return appBoot.then(() => {
            app.instance.meta = app.config;
            if (autoRun) {
                // Remove all Authentication modules except the one defined in the bootstrap config
                const modules = app.config.modules;
                if (app.config.name !== this.config.authentication && app.config.name !== 'Core.Webiny') {
                    delete modules['Authentication'];
                }
                app.instance.meta = app.config;
                app.instance.addModules(modules);

                _.set(Webiny.Apps, app.config.name, app.instance);
                // Do not run main app (defined in TPL bootstrap)
                if (this.config.app === app.config.name) {
                    return app;
                }
                return app.instance.run().then(() => app);
            }
            return app;
        });
    }

    includeCss(filename) {
        const file = document.createElement('link');
        file.rel = 'stylesheet';
        file.type = 'text/css';
        file.href = webinyCssPath + filename;

        if (typeof file !== 'undefined') {
            document.getElementsByTagName('head')[0].appendChild(file);
        }
    }

    includeScript(filename, attributes = {}) {
        const file = document.createElement('script');
        _.each(attributes, (v, k) => {
            file.setAttribute(k, v);
        });
        file.setAttribute('src', webinyJsPath + filename);
        document.head.appendChild(file);
    }
}

export default WebinyBootstrapClass;
