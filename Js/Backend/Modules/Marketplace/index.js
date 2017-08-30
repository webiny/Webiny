import React from 'react';
import Webiny from 'webiny';
import LoginRegister from './Views/LoginRegister';
import Browse from './Views/Browse';
import AppDetails from './Views/AppDetails';

class Project extends Webiny.App.Module {

    init() {
        this.name = 'Marketplace';

        this.registerMenus(
            <Webiny.Ui.Menu label="Marketplace" icon="icon-basket_n" route="Marketplace.Browse"/>
        );

        this.registerRoutes(
            new Webiny.Route('Marketplace.LoginRegister', '/marketplace/login-register', LoginRegister, 'Marketplace'),
            new Webiny.Route('Marketplace.Browse', '/marketplace', Browse, 'Marketplace'),
            new Webiny.Route('Marketplace.AppDetails', '/marketplace/details', AppDetails, 'Marketplace'),
        );
    }
}

export default Project;