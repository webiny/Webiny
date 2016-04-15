import Webiny from 'Webiny';
import CheckboxGroupContainer from './CheckboxGroupContainer';
import Checkbox from './Checkbox';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.CheckboxGroup = CheckboxGroupContainer;
        Webiny.Ui.Components.Checkbox = Checkbox;
    }
}

export default Module;
