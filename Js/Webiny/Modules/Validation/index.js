import Webiny from 'Webiny';
import Validator from './Validator';

class Module extends Webiny.Module {

    init() {
        Webiny.Validator = Validator;
    }
}

export default Module;
