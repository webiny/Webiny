export default {
    loadCms: () => {
        const api = new Webiny.Api.Service('/apps');
        return api.get('/backend').then(res => {
            let apps = Q();
            _.forIn(res.getData(), config => {
                apps = apps.then(() => {
                    return WebinyBootstrap.includeApp(config.name, config).then(appInstance => {
                        appInstance.addModules(config.modules);
                        _.set(Webiny.Apps, config.name, appInstance);
                        appInstance.run();
                    });
                });
            });
            return apps;
        });
    },

    loadData: () => {
        Webiny.Model.set({
            Core: {
                Layout: {
                    name: 'Webiny',
                    domains: [
                        'webiny.com',
                        'google.com',
                        'slack.com'
                    ]
                }
            }
        });
    }
};
