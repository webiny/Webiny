import Webiny from 'Webiny';
import Filters from './Filters';

class Module extends Webiny.Module {

    constructor(app) {
        super(app);
        Webiny.Tools.Filters = Filters;
    }
}

export default Module;
