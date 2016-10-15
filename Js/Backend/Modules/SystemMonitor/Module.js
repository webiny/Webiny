import Webiny from 'Webiny';
import Dashboard from './Dashboard';

class SystemMonitor extends Webiny.Module {

    init() {
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            new Menu('DevTools', [
                new Menu('System Monitor', 'SystemMonitor.Dashboard')
            ], 'icon-tools').setRole('administrator')
        );

        this.registerRoutes(
            new Webiny.Route('SystemMonitor.Dashboard', '/system-monitor', Dashboard, 'SystemMonitor - Dashboard')
        );
    }
}

export default SystemMonitor;