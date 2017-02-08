import Webiny from 'Webiny';
import Switch from './Switch';
import SwitchButton from './SwitchButton';

class Module extends Webiny.Module {

    init() {
        this.name = 'Switch';
        Webiny.Ui.Components.Switch = Switch;
        Webiny.Ui.Components.SwitchButton = SwitchButton;
    }
}

export default Module;
