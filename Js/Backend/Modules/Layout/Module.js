import Webiny from 'Webiny';
import Components from './Components/Components';
import Views from './Views/Views';

class Module extends Webiny.Module {

    init() {
        const Menu = Webiny.Ui.Menu;

        this.registerSettings(
            new Webiny.Ui.Settings('ui', 'Content', <h2>Content Settings</h2>),
            new Webiny.Ui.Settings('payments', 'Payments', Views.UiSettings)
        );


        /*this.registerMenus(
            new Menu('Dashboard', 'Dashboard', 'icon-gauge'),
            new Menu('Content', [
                new Menu('Posts', null).setAction('Add post', null, 'icon-plus-circled'),
                new Menu('Menus', [
                    new Menu('Add new page', null),
                    new Menu('View all pages', null)
                ])
            ], 'icon-browser')
        );*/

        this.registerRoutes(
            new Webiny.Route('Dashboard', '/', {
                MasterContent: Views.Example
            })
        );

        this.registerDefaultComponents({
            Header: Components.Navigation,
            MasterLayout: Views.Main
        });
    }
}

export default Module;