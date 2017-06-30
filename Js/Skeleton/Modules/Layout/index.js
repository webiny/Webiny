import Webiny from 'Webiny';
import Components from './Components/Components';
import DefaultLayout from './Layout';
import EmptyLayout from './EmptyLayout';
import Dashboard from './Views/Dashboard';

class Layout extends Webiny.App.Module {

    init() {
        this.name = 'Layout';
        this.registerDefaultLayout(DefaultLayout);
        this.registerLayout('empty', EmptyLayout);
        this.registerComponents(Components);

        this.registerDefaultComponents({
            Header: Components.Header
        });

        this.registerRoutes(
            new Webiny.Route('Dashboard', '/dashboard', Dashboard, 'Dashboard')
        );

        Webiny.Router.setDefaultRoute('Dashboard');
    }
}

export default Layout;