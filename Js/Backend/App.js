import Webiny from 'webiny';
import _ from 'lodash';
import dynamics from 'dynamics.js';

import Acl from './Modules/Acl';
import Layout from './Modules/Layout';
import Logger from './Modules/Logger';
import Dashboard from './Modules/Dashboard';
import Marketplace from './Modules/Marketplace';
import './Components';

class Backend extends Webiny.App {
    constructor() {
        super('Webiny.Backend');
        this.modules = [
            new Acl(this),
            new Layout(this),
            new Logger(this),
            new Dashboard(this),
            new Marketplace(this)
        ];
    }

    run() {
        this.loader = document.querySelector('.preloader-wrap');
        return super.run().then(() => {
            this.off = Webiny.Router.onRouteChanged(() => this.hideLoader());
            // Configure Router
            Webiny.Router.setBaseUrl('/' + Webiny.Config.Js.Backend);
            Webiny.Router.setTitlePattern('%s | Webiny');

            // Load other backend apps
            const api = new Webiny.Api.Endpoint('/services/webiny/apps');
            return api.get('/backend').then(res => {
                let apps = Promise.resolve();
                _.forIn(res.getData(), config => {
                    apps = apps.then(() => Webiny.includeApp(config).then(app => app.run()));
                });
                return apps;
            });
        });
    }

    hideLoader() {
        if (this.loader) {
            this.off();
            setTimeout(() => {
                dynamics.animate(this.loader, {
                    opacity: 0
                }, {
                    type: dynamics.easeOut,
                    duration: 500,
                    complete: () => {
                        this.loader.style.display = 'none';
                        this.loader = null;
                    }
                });
            }, 100);
        }
    }

}

Webiny.registerApp(new Backend());