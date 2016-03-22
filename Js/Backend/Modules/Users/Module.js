import Webiny from 'Webiny';
import Views from './Views/Views';

class Module extends Webiny.Module {

    init() {
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            new Menu('Users', 'Users.List', 'icon-users')
        );

        this.registerRoutes(
            new Webiny.Route('Users.Form', '/users/:id', {
                MasterContent: Views.Form
            }),
            new Webiny.Route('Users.List', '/users', {
                MasterContent: Views.List
            })
        );
    }
}

export default Module;