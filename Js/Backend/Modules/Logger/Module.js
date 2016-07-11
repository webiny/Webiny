import Webiny from 'Webiny';
import Views from './Views/Views';

class Logger extends Webiny.Module {

    init() {
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            new Menu('DevTools', [
                new Menu('Logger', 'Logger.ListErrors')
            ], 'icon-bell')
        );

        this.registerRoutes(
            new Webiny.Route('Logger.ListErrors', '/logger/list', Views.ListErrors, 'Logger - List Errors')
        );
    }
}

export default Logger;