import Webiny from 'Webiny';
import Hidden from './Hidden';

class Module extends Webiny.Module {

    init() {
        this.name = 'Hidden';
        Webiny.Ui.Components.Hidden = Hidden;
    }
}

export default Module;
