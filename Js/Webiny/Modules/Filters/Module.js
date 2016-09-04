import Webiny from 'Webiny';
import Filter from './Filter';
import DateTime from './DateTime';
import FileSize from './FileSize';

class Module extends Webiny.Module {

    constructor(app) {
        super(app);
        Webiny.Tools.Filter = Filter;
        Webiny.Ui.Components.Filters.DateTime = DateTime;
        Webiny.Ui.Components.Filters.FileSize = FileSize;
    }
}

export default Module;
