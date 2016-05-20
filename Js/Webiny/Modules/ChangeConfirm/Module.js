import Webiny from 'Webiny';
import ChangeConfirm from './ChangeConfirm';

class Module extends Webiny.Module {

    constructor(app) {
        super(app);
        Webiny.Ui.Components.ChangeConfirm = ChangeConfirm;
    }
}

export default Module;
