import Webiny from 'Webiny';
import Validator from './Validator';

class Module extends Webiny.Module {

    constructor(app) {
        super(app);
        Webiny.Tools.Validator = Validator;
    }
}

export default Module;
