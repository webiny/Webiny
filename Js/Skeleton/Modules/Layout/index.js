import React from 'react';
import Webiny from 'webiny';
import Header from './Components/Header';
import DefaultLayout from './Layout';
import EmptyLayout from './EmptyLayout';
import Dashboard from './Views/Dashboard';

class Layout extends Webiny.App.Module {

    init() {
        this.name = 'Layout';
        this.registerDefaultLayout(DefaultLayout);
        this.registerLayout('empty', EmptyLayout);
        this.registerDefaultComponents({Header});

        this.registerRoutes(
            new Webiny.Route('Dashboard', '/', Dashboard, 'Dashboard')
        );

        Webiny.Router.setDefaultRoute('Dashboard');

        Webiny.registerModule(
            new Webiny.Module('Webiny/Skeleton/AccountPreferencesMenuItem', () => import('./Components/UserMenu').then(m => m.AccountPreferences)).setTags('user-menu-item'),
            new Webiny.Module('Webiny/Skeleton/LogoutMenuItem', () => import('./Components/UserMenu').then(m => m.Logout)).setTags('user-logout-menu-item')
        );
    }
}

export default Layout;