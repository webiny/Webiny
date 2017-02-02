import Webiny from 'Webiny';
import RadioGroup from './RadioGroup';
import Radio from './Radio';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.RadioGroup = RadioGroup;
        Webiny.Ui.Components.Radio = Radio;
    }
}

export default Module;
