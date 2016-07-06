import Webiny from 'Webiny';
import Filter from './Filter';
import DateTime from './DateTime';

class Module extends Webiny.Module {

    constructor(app) {
        super(app);
        Webiny.Tools.Filter = Filter;
        Webiny.Ui.Components.Filters.DateTime = DateTime;
    }
}

export default Module;
