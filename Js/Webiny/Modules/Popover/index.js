import Webiny from 'Webiny';
import Popover from './Popover';

class Module extends Webiny.Module {

    init() {
        this.name = 'Popover';
        Webiny.Ui.Components.Popover = Popover;
    }
}

export default Module;
