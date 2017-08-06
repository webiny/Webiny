import Webiny from 'webiny';
import React from 'react';
import Dashboard from './Views/Dashboard';

class Module extends Webiny.App.Module {

    init() {
        this.name = 'Dashboard';

        this.registerMenus(
            <Webiny.Ui.Menu order="0" label="Dashboard" route="Dashboard" icon="fa-home"/>
        );

        this.registerRoutes(
            new Webiny.Route('Dashboard', '/dashboard', Dashboard, 'Dashboard')
        );
    }
}

export default Module;