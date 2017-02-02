import Webiny from 'Webiny';
import Components from './Components/Components';
import Layout from './Layout';
import EmptyLayout from './EmptyLayout';
import Dashboard from './Views/Dashboard';

class Module extends Webiny.Module {

    init() {
        this.registerDefaultLayout(Layout);
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

export default Module;