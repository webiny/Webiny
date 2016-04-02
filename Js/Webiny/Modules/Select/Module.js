import Webiny from 'Webiny';
import SelectContainer from './SelectContainer';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Select = SelectContainer;
    }
}

export default Module;
