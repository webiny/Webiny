import Webiny from 'Webiny';
import CheckboxGroupContainer from './CheckboxGroupContainer';
import CheckboxGroup from './CheckboxGroup';
import Checkbox from './Checkbox';

class Module extends Webiny.Module {

    constructor(app) {
        super(app);
        Webiny.Ui.Components.CheckboxGroup = CheckboxGroupContainer;
        Webiny.Ui.Components.Checkbox = Checkbox;
    }
}

export default Module;
