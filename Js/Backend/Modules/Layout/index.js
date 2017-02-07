import Webiny from 'Webiny';
import Components from './Components';

class Module extends Webiny.Module {

    init() {
        this.registerComponents(Components);
        this.registerDefaultComponents({
            Header: Components.Header,
            Footer: Components.Footer
        });

        // Remove route registered by Skeleton app
        Webiny.Router.deleteRoute('Dashboard');
        // Set a new default route
        Webiny.Router.setDefaultRoute('Users.List');
    }
}

export default Module;