import Webiny from 'Webiny';
import Views from './Views/Views';

class Logger extends Webiny.Module {

    init() {
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            new Menu('DevTools', [
                new Menu('Logger', 'Logger.ListErrors')
            ], 'icon-tools').setRole('logger-manager')
        );

        this.registerRoutes(
            new Webiny.Route('Logger.ListErrors', '/logger/list', Views.Main, 'Logger - List Errors')
        );
    }
}

export default Logger;