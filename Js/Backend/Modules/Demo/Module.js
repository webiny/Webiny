import Webiny from 'Webiny';
import Views from './Views/Views';

class Module extends Webiny.Module {

    init() {
        /*const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            new Menu('Demo', 'Demo.List', 'icon-website')
        );*/

        this.registerRoutes(
            new Webiny.Route('Demo.Form', '/demo/:id', {
                MasterContent: Views.Form
            }),
            new Webiny.Route('Demo.List', '/demo', {
                MasterContent: Views.List
            })
        );
    }
}

export default Module;