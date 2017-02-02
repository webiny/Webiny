import Webiny from 'Webiny';
import Button from './Button';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Button = Button;
    }
}

export default Module;
