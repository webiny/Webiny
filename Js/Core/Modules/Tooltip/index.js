import Webiny from 'Webiny';
import Tooltip from './Tooltip';

class Module extends Webiny.Module {

    init() {
        this.name = 'Tooltip';
        Webiny.Ui.Components.Tooltip = Tooltip;
    }
}

export default Module;
