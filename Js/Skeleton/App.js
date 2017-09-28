import Webiny from 'webiny';

import 'Assets/styles.scss';
import 'Assets/images/public/bg-login.png';
import 'Assets/images/public/preloader_2.png';
import 'Assets/images/public/favicon.ico';
import 'Assets/images/public/logo_orange.png';
import UserAccount from './Modules/UserAccount';
import Layout from './Modules/Layout';
import Auth from './Auth';
import registerComponents from './Components';

class Skeleton extends Webiny.App {
    constructor() {
        super('Webiny.Skeleton');
        registerComponents();
        this.modules = [
            new Layout(this),
            new UserAccount(this)
        ];

        Webiny.Router.setDefaultRoute('Dashboard');
        Webiny.Auth = new Auth();
    }
}

Webiny.registerApp(new Skeleton());
