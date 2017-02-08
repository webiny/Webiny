import Webiny from 'Webiny';
import ChangeConfirm from './ChangeConfirm';

class Module extends Webiny.Module {

    init() {
        this.name = 'ChangeConfirm';
        Webiny.Ui.Components.ChangeConfirm = ChangeConfirm;
    }
}

export default Module;
