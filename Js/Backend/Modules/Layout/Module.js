import Webiny from 'Webiny';
import UiSettings from './Views/UiSettings';

class Module extends Webiny.Module {

    init() {
        const Menu = Webiny.Ui.Menu;

        this.registerSettings(
            new Webiny.Ui.Settings('ui', 'Content', <h2>Content Settings</h2>),
            new Webiny.Ui.Settings('payments', 'Payments', UiSettings)
        );


        this.registerMenus(
            new Menu('Dashboard', null, 'icon-gauge'),
            new Menu('Content', [
                new Menu('Posts', null).setAction('Add post', null, 'icon-plus-circled'),
                new Menu('Menus', [
                    new Menu('Add new page', null),
                    new Menu('View all pages', null)
                ])
            ], 'icon-browser')
        );
    }
}

export default Module;