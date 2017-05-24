import Webiny from 'Webiny';
import RadioGroup from './RadioGroup';
import Radio from './Radio';

class Module extends Webiny.Module {

    init() {
        this.name = 'Radio';
        Webiny.Ui.Components.RadioGroup = RadioGroup;
        Webiny.Ui.Components.Radio = Radio;
    }
}

export default Module;
