import Webiny from 'Webiny';
import Components from './Components/Components';
import Layout from './Layout';
import EmptyLayout from './EmptyLayout';

class Module extends Webiny.Module {

    init() {
        this.registerDefaultLayout(Layout);
        this.registerLayout('empty', EmptyLayout);

        this.registerDefaultComponents({
            Header: Components.Navigation
        });
    }
}

export default Module;