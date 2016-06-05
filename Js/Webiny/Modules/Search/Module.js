import Webiny from 'Webiny';
import Search from './Search';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Search = Search;
    }
}

export default Module;
