import Webiny from 'Webiny';

// Find Webiny app or components and run them
function runWebiny(meta) {
    const config = WebinyBootstrap.config;
    const appElement = document.querySelector('webiny-app');
    if (appElement) {
        const appName = config.app;
        const authenticationApp = config.authentication || 'Core.Backend';
        Webiny.Router.setBaseUrl(config.baseUrl);
        WebinyBootstrap.includeApp(appName).then(app => {
            // Filter modules
            const modules = meta[appName].modules;
            if (appName !== authenticationApp) {
                delete modules['Authentication'];
            }
            app.addModules(modules);
            _.set(Webiny.Apps, appName, app);
            app.run(appElement);
        });
    }
}

class WebinyBootstrapClass {

    constructor() {
        this.meta = {};
    }

    import(path) {
        return System.import(path).catch(e => console.error(e));
    }

    run(config) {
        this.config = config;
        this.env = window.WebinyEnvironment;
        window._apiUrl = '/api';
        if (this.env === 'development') {
            window.Webiny = Webiny;
        }

        // First we need to import Core/Webiny
        this.includeApp('Core.Webiny').then(app => {
            app.addModules(this.meta['Core.Webiny'].modules).run().then(() => {
                runWebiny(this.meta);
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
            return this.import(meta.name).then(m => m.default);
        });
    }


    includeApp(appName, meta) {
        if (!meta) {
            return axios({url: _apiUrl + '/services/core/apps/' + appName}).then(res => {
                this.meta[appName] = res.data.data;
                return this.loadAssets(this.meta[appName]);
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
}

export default WebinyBootstrapClass;
