import Webiny from 'Webiny';
import ClickSuccess from './ClickSuccess';

class Module extends Webiny.Module {

    init() {
        this.name = 'ClickSuccess';
        Webiny.Ui.Components.ClickSuccess = ClickSuccess;
    }
}

export default Module;
