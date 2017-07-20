import _ from 'lodash';
import Webiny from 'Webiny';
import Acl from './Modules/Acl';
import Layout from './Modules/Layout';
import Logger from './Modules/Logger';
import Auth from './Auth';
import './Components';

class Backend extends Webiny.App {
    constructor() {
        super('Webiny.Backend');
        this.modules = [
            new Acl(this),
            new Layout(this),
            new Logger(this)
        ];

        this.beforeRender(() => {
            // Load other backend apps
            const api = new Webiny.Api.Endpoint('/services/webiny/apps');
            return api.get('/backend').then(res => {
                let apps = Promise.resolve();
                _.forIn(res.getData(), config => {
                    apps = apps.then(() => Webiny.includeApp(config.name, config).then(app => {
                        if (config.name === window.Webiny.auth) {
                            Webiny.Auth = app.getAuth();
                        }
                        app.run();
                    }));
                });
                return apps;
            });
        });
    }

    getAuth() {
        return new Auth();
    }
}

Webiny.registerApp(new Backend());