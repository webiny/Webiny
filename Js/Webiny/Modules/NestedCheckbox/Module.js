import Webiny from 'Webiny';
import CheckboxGroupContainer from './CheckboxGroupContainer';
import Checkbox from './Checkbox';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.NestedCheckboxGroup = CheckboxGroupContainer;
        Webiny.Ui.Components.NestedCheckbox = Checkbox;
    }
}

export default Module;
