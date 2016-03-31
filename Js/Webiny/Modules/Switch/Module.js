import Webiny from 'Webiny';
import Switch from './Switch';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Switch = Switch;
    }
}

export default Module;
