import Webiny from 'Webiny';
import SelectContainer from './SelectContainer';
import SelectInput from './SelectInput';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Select = SelectContainer;
        Webiny.Ui.Components.SelectInput = SelectInput;
    }
}

export default Module;
