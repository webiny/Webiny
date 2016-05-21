import Webiny from 'Webiny';
import ClickConfirm from './ClickConfirm';

class Module extends Webiny.Module {

    constructor(app) {
        super(app);
        Webiny.Ui.Components.ClickConfirm = ClickConfirm;
    }
}

export default Module;
