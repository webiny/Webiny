import Webiny from 'Webiny';
import Button from './Button';

class Module extends Webiny.Module {

    constructor(app) {
        super(app);
        Webiny.Ui.Components.Button = Button;
    }
}

export default Module;
