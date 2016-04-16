import Webiny from 'Webiny';
import InputContainer from './InputContainer';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Input = InputContainer;
    }
}

export default Module;
