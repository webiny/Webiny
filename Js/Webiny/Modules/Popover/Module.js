import Webiny from 'Webiny';
import Popover from './Popover';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Popover = Popover;
    }
}

export default Module;
