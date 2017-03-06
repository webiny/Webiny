import Webiny from 'Webiny';
import Alert from './Alert';

class Module extends Webiny.Module {

    init() {
        this.name = 'Alert';
        Webiny.Ui.Components.Alert = Alert;
    }
}

export default Module;
