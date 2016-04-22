import Webiny from 'Webiny';
import Filter from './Filter';

class Module extends Webiny.Module {

    constructor(app) {
        super(app);
        Webiny.Tools.Filter = Filter;
    }
}

export default Module;
