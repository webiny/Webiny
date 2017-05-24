import Webiny from 'Webiny';
import Views from './Views/Views';

class Logger extends Webiny.Module {

    init() {
        this.name = 'Logger';
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            new Menu('System', [
                new Menu('Error Logger', 'Logger.ListErrors')
            ], 'icon-tools').setRole('webiny-logger-manager')
        );

        this.registerRoutes(
            new Webiny.Route('Logger.ListErrors', '/logger/list', Views.Main, 'Logger - List Errors')
        );
    }
}

export default Logger;