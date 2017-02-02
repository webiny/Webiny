import Webiny from 'Webiny';
import Acl from './Modules/Acl';
import Authentication from './Modules/Authentication';
import Layout from './Modules/Layout';
import Logger from './Modules/Logger';

class Backend extends Webiny.App {
    constructor() {
        super('Core.Backend');
        this.modules = [
            new Acl(this),
            new Authentication(this),
            new Layout(this),
            new Logger(this)
        ];

        Webiny.Http.addRequestInterceptor(http => {
            if (Webiny.Cookies.get('XDEBUG_SESSION')) {
                if (!http.query) {
                    http.query = {};
                }
                http.query.XDEBUG_SESSION_START = Webiny.Cookies.get('XDEBUG_SESSION');
            }
        });

        this.beforeRender(() => {
            // Load other backend apps
            const api = new Webiny.Api.Endpoint('/services/core/apps');
            return api.get('/backend').then(res => {
                let apps = Promise.resolve();
                _.forIn(res.getData(), config => {
                    apps = apps.then(() => Webiny.includeApp(config.name, config).then(app => app.run()));
                });
                return apps;
            });
        });
    }
}

Webiny.registerApp(new Backend());