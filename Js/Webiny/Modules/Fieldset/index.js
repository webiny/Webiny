import Webiny from 'Webiny';
import Fieldset from './Fieldset';

class Module extends Webiny.Module {
    init() {
        Webiny.Ui.Components.Fieldset = Fieldset;
    }
}

export default Module;
