import Webiny from 'Webiny';
import ClickConfirm from './ClickConfirm';

class Module extends Webiny.Module {

    init() {
        this.name = 'ClickConfirm';
        Webiny.Ui.Components.ClickConfirm = ClickConfirm;
    }
}

export default Module;
