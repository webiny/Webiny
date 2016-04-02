import Webiny from 'Webiny';
import RadioGroupContainer from './RadioGroupContainer';
import Radio from './Radio';

class Module extends Webiny.Module {

    constructor(app) {
        super(app);
        Webiny.Ui.Components.RadioGroup = RadioGroupContainer;
        Webiny.Ui.Components.Radio = Radio;
    }
}

export default Module;
