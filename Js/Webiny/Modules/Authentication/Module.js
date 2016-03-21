import Webiny from 'Webiny';
import Authentication from './Authentication';

class Module extends Webiny.Module {

    constructor(app) {
        super(app);
        Webiny.Modules.Authentication = Authentication;
    }
}

export default Module;
