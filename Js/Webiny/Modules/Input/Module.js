import Webiny from 'Webiny';
import Input from './Input';

class Module extends Webiny.Module {

    constructor(app) {
        super(app);
        this.name = 'Input';
        Webiny.Ui.Input = Input;
    }
}

export default Module;
