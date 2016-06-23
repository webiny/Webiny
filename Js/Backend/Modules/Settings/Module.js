import Webiny from 'Webiny';
import Views from './Views/Views';

class Module extends Webiny.Module {

    init() {
        const route = new Webiny.Route('Settings', '/settings/:settingsKey', {
            MasterContent: Views.Settings
        });
        this.registerRoutes(route);

        /*
        const Menu = Webiny.Ui.Menu;
        const items = () => {
            return Webiny.Tools.getAppsSettings().map(settings => {
                return new Menu(settings.label, route.getHref({settingsKey: settings.key}));
            });
        };

        this.registerMenus(
            new Menu('Settings', items, 'icon-settings')
        );
        */
    }
}

export default Module;