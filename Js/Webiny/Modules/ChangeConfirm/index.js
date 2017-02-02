import Webiny from 'Webiny';
import ChangeConfirm from './ChangeConfirm';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.ChangeConfirm = ChangeConfirm;
    }
}

export default Module;
