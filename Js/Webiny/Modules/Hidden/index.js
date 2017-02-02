import Webiny from 'Webiny';
import Hidden from './Hidden';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Hidden = Hidden;
    }
}

export default Module;
