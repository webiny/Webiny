import Webiny from 'Webiny';
import ClickSuccess from './ClickSuccess';

class Module extends Webiny.Module {

    constructor(app) {
        super(app);
        Webiny.Ui.Components.ClickSuccess = ClickSuccess;
    }
}

export default Module;
