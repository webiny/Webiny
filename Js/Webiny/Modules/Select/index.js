import Webiny from 'Webiny';
import Select from './Select';
import SimpleSelect from './SimpleSelect';

class Module extends Webiny.Module {

    init() {
        this.name = 'Select';
        Webiny.Ui.Components.Select = Select;
        Webiny.Ui.Components.SimpleSelect = SimpleSelect;
    }
}

export default Module;
