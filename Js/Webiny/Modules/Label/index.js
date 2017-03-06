import Webiny from 'Webiny';
import Label from './Label';

class Module extends Webiny.Module {

    init() {
        this.name = 'Label';
        Webiny.Ui.Components.Label = Label;
    }
}

export default Module;
