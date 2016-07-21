import Webiny from 'Webiny';
import Components from './Components/Components';
import Main from './Main';

class Module extends Webiny.Module {

    init() {
        this.registerDefaultComponents({
            Header: Components.Navigation,
            MasterLayout: Main
        });
    }
}

export default Module;