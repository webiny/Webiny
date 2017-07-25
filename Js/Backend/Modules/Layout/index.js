import Webiny from 'Webiny';
import Footer from './Footer';

class Layout extends Webiny.App.Module {

    init() {
        this.name = 'Layout';
        this.registerDefaultComponents({Footer});

        // Remove route registered by Skeleton app
        Webiny.Router.deleteRoute('Dashboard');
        // Set a new default route
        Webiny.Router.setDefaultRoute('Users.List');
    }
}

export default Layout;