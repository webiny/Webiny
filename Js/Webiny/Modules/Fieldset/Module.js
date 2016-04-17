import Webiny from 'Webiny';
import Fieldset from './Fieldset';

class Module extends Webiny.Module {

    constructor(app) {
        super(app);
        Webiny.Ui.Components.Fieldset = Fieldset;
    }
}

export default Module;
