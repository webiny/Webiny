import Webiny from 'Webiny';
import Alert from './Alert';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Alert = Alert;
    }
}

export default Module;
