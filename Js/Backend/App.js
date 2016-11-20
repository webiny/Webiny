import Webiny from 'Webiny';

const backend = new Webiny.App('Core.Backend');
backend.beforeRender(() => {
    const authenticationApp = WebinyBootstrap.config.authentication || 'Core.Backend';
    // Load other backend apps
    const api = new Webiny.Api.Endpoint('/services/core/apps');
    return api.get('/backend').then(res => {
        let apps = Promise.resolve();
        _.forIn(res.getData(), config => {
            apps = apps.then(() => {
                return WebinyBootstrap.includeApp(config.name, config).then(app => {
                    let appBoot = Promise.resolve();

                    // Check if app instance contains any dependencies and load them before running this app
                    _.each(app.instance.dependencies || [], depName => {
                        appBoot = appBoot.then(() => WebinyBootstrap.includeApp(depName, true));
                    });

                    // Remove all Authentication modules, except the one defined in bootstrap config
                    const modules = config.modules;
                    if (config.name !== authenticationApp) {
                        delete modules['Authentication'];
                    }

                    return appBoot.then(() => {
                        const appInstance = app.instance;
                        app.instance.meta = app.config;
                        appInstance.addModules(modules);
                        _.set(Webiny.Apps, config.name, appInstance);
                        appInstance.run();
                    });
                });
            });
        });
        return apps;
    });
});

export default backend;
