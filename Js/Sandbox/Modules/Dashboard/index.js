import Webiny from 'Webiny';
import Dashboard from './Dashboard';

class Module extends Webiny.Module {
    init() {
        this.name = 'Module';
        this.registerMenus(
            new Webiny.Ui.Menu('Dashboard', 'Dashboard', 'fa-home')
        );

        this.registerRoutes(
            new Webiny.Route('Dashboard', '/dashboard', Dashboard, 'Dashboard')
        );
    }
}

export default Module;