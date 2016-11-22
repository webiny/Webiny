import Webiny from 'Webiny';

const backend = new Webiny.App('Core.Backend');
backend.beforeRender(() => {
    Webiny.Http.addRequestInterceptor(http => {
        if (Webiny.Cookies.get('XDEBUG_SESSION')) {
            http.query.XDEBUG_SESSION_START = Webiny.Cookies.get('XDEBUG_SESSION');
        }
    });

    // Load other backend apps
    const api = new Webiny.Api.Endpoint('/services/core/apps');
    return api.get('/backend').then(res => {
        let apps = Promise.resolve();
        _.forIn(res.getData(), config => {
            apps = apps.then(() => {
                return WebinyBootstrap.includeApp(config.name, config);
            });
        });
        return apps;
    });
});

export default backend;
