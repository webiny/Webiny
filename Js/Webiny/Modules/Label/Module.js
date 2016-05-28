import Webiny from 'Webiny';
import Label from './Label';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Label = Label;
    }
}

export default Module;
