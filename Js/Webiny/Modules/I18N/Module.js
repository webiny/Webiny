import Webiny from 'Webiny';
import I18N from './I18N';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.I18N = I18N;
    }
}

export default Module;