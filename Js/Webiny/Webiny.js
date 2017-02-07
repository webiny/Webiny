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

    run(config) {
        this.loadStylesheet(webinyMeta['Core.Webiny'].css);
        return this.loadScript(webinyMeta['Core.Webiny'].app).then(() => {
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
            // Mount RootElement
            const RootElement = this.RootElement;
            this.app = ReactDOM.render(<RootElement/>, document.querySelector('webiny-app'));
        });
    }

    registerApp(app) {
        this.Apps[app.name] = app;
        return this;
    }

    configure(path, config) {
        let target = this.Apps;
        if (path.indexOf('Webiny.Ui') === 0) {
            target = this.Ui;
            path = path.replace('Webiny.Ui', '');
        }

        const props = _.get(target, path + '.defaultProps');
        if (props) {
            _.merge(props, config);
        }
    }

    loadScript(url) {
        return new Promise(resolve => {
            const s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = url;
            s.async = true;
            s.onload = () => resolve();
            document.body.appendChild(s);
        });
    }

    loadStylesheet(url) {
        return new Promise(resolve => {
            const s = document.createElement('link');
            s.rel = 'stylesheet';
            s.href = url;
            s.onload = resolve;
            document.head.appendChild(s);
        });
    }

    includeApp(name, config) {
        const runApp = (appConfig) => {
            let loader = Promise.resolve();
            if (_.has(appConfig, 'vendor')) {
                loader = loader.then(() => this.loadScript(appConfig['vendor']));
            }

            if (_.has(appConfig, 'app')) {
                loader = loader.then(() => this.loadScript(appConfig['app']));
            }

            if (_.has(appConfig, 'css')) {
                this.loadStylesheet(appConfig['css']);
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
            return this.Apps[name];
        });
    }

    isElementOfType(element, type) {
        if (!React.isValidElement(element)) {
            return false;
        }

        if (PRODUCTION) {
            return element.type === type || element.type.prototype instanceof type;
        }

        if (DEVELOPMENT) {
            // In development `react-hot-loader` is wrapping components into a Proxy component so we need to check type like this
            return element.type.prototype instanceof type;
        }
    }
}

module.exports = new Webiny;