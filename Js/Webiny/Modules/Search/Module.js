import Webiny from 'Webiny';
import SearchContainer from './SearchContainer';
import SearchInput from './SearchInput';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Search = SearchContainer;
        Webiny.Ui.Components.SearchInput = SearchInput;
    }
}

export default Module;
