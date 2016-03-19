import Webiny from 'Webiny';
import SelectContainer from './SelectContainer';

class Module extends Webiny.Module {

    constructor(app) {
        super(app);
        Webiny.Ui.Components.Select = SelectContainer;
    }
}

export default Module;
