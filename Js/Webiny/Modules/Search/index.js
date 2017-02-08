import Webiny from 'Webiny';
import Search from './Search';

class Module extends Webiny.Module {

    init() {
        this.name = 'Search';
        Webiny.Ui.Components.Search = Search;
    }
}

export default Module;
