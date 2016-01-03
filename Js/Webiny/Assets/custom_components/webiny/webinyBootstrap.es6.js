// Find Webiny app or components and run them
function runWebiny(meta) {
    // Run app
    const appElement = document.querySelector('webiny-app');
    if (appElement) {
        const appName = appElement.attributes.name.nodeValue;
        const baseUrl = appElement.attributes['base-url'].nodeValue;
        Webiny.Router.setBaseUrl(baseUrl);
        WebinyBootstrap.includeApp(appName).then(app => {
            app.addModules(meta[appName].modules);
            _.set(window.Webiny.Apps, appName, app);
            app.run(appElement);
        });
    }

    // Mount components
    const componentElements = document.querySelectorAll('webiny-component');
    if (componentElements) {
        _.each(componentElements, el => {
            const props = {};
            _.each(el.attributes, attr => {
                props[attr.nodeName] = attr.nodeValue;
            });

            const component = _.get(window, props.name);
            if (component) {
                const element = React.createElement(component, props, el.innerHTML);
                ReactDOM.render(element, el);
            } else {
                el.remove();
            }
        });
    }
}

class WebinyBootstrapClass {

    constructor() {
        this.meta = {};
    }

    import(path) {
        const parts = path.split('.');
        if (parts.length === 2 && !_.startsWith(path, './')) {
            path = '/build/' + this.env + '/' + parts.join('/') + '/scripts/app.min.js';
        }
        return System.import(path).catch(
            console.error.bind(console)
        );
    }

    run(env = 'development') {
        this.env = env;
        window._apiUrl = '/api';
        // First we need to import Core/Webiny
        this.includeApp('Core.Webiny').then(app => {
            app.addModules(this.meta['Core.Webiny'].modules).run().then(() => {
                runWebiny(this.meta);
            });
        });
    }


    includeApp(appName) {
        return axios({url: _apiUrl + '/apps/' + appName}).then(res => {
            const meta = this.meta[appName] = res.data.data;
            const assets = [];
            _.each(_.get(meta.assets, 'js', []), item => {
                if (appName === 'Core.Webiny' && _.endsWith(item, 'vendors.min.js')) {
                    return;
                }

                assets.push(this.import('/build/' + this.env + '/' + item));
            });
            _.each(_.get(meta.assets, 'css', []), item => {
                this.includeCss('/build/' + this.env + '/' + item);
            });

            return Q.all(assets).then(() => {
                const parts = appName.split('.');
                return this.import(parts[1]).then(m => m.default);
            });
        });
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
