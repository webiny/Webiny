import Webiny from 'Webiny';
import Validator from './Validator';

class Module extends Webiny.Module {

    init() {
        this.name = 'Validation';
        Webiny.Validator = Validator;
    }
}

export default Module;
