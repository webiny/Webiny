import Webiny from 'Webiny';
import CheckboxGroup from './CheckboxGroup';
import Checkbox from './Checkbox';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.CheckboxGroup = CheckboxGroup;
        Webiny.Ui.Components.Checkbox = Checkbox;
    }
}

export default Module;
