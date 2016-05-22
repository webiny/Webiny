import Webiny from 'Webiny';

const backend = new Webiny.App('Core.Backend');
backend.beforeRender(() => {
    const authenticationApp = WebinyBootstrap.config.authentication || 'Core.Backend';
    // Load other backend apps
    const api = new Webiny.Api.Endpoint('/services/core/apps');
    return api.get('/backend').then(res => {
        let apps = Q();
        _.forIn(res.getData(), config => {
            apps = apps.then(() => {
                return WebinyBootstrap.includeApp(config.name, config).then(app => {
                    const appInstance = app.instance;
                    // Filter modules
                    const modules = config.modules;
                    if (config.name !== authenticationApp) {
                        delete modules['Authentication'];
                    }

                    app.instance.meta = app.config;
                    appInstance.addModules(modules);
                    _.set(Webiny.Apps, config.name, appInstance);
                    appInstance.run();
                });
            });
        });
        return apps;
    });
});

export default backend;
