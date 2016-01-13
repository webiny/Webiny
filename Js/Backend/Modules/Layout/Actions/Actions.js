const actions = {
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

    /**
     * @description Loads data from data source
     * @param name
     */
    loadData: (name = 'Webiny') => {
        Webiny.Model.set({
            Core: {
                Layout: {
                    name,
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

// TODO: razmisli kako ovo izvesti u buildu, preko JsDoc sintakse
actions.loadData.description = 'Loads data from data source';

export default actions;