const actions = {
    loadCms: () => {
        const api = new Webiny.Api.Endpoint('/services/core/apps');
        return api.get('/Cms.Backend').then(res => {
            const config = res.getData();
            return WebinyBootstrap.includeApp(config.name, config).then(appInstance => {
                appInstance.addModules(config.modules);
                _.set(Webiny.Apps, config.name, appInstance);
                appInstance.run();
            });
        });
    },

    /**
     * @description Loads data from data source
     * @param name
     */
    loadData: (name = 'Webiny') => {
        Webiny.Model.set('Core', {
            Layout: {
                name,
                domains: [
                    'webiny.com',
                    'google.com',
                    'slack.com'
                ]
            }
        });
    }
};

export default actions;