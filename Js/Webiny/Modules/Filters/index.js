import Webiny from 'Webiny';
import Filter from './Filter';
import DateTime from './DateTime';
import FileSize from './FileSize';

class Module extends Webiny.Module {

    init() {
        this.name = 'Filters';
        Webiny.Filter = Filter;
        Webiny.Ui.Components.Filters.DateTime = DateTime;
        Webiny.Ui.Components.Filters.FileSize = FileSize;
    }
}

export default Module;
