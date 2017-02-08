import Webiny from 'Webiny';
import Loader from './Loader';

class Module extends Webiny.Module {

    init() {
        this.name = 'Loader';
        Webiny.Ui.Components.Loader = Loader;
    }
}

export default Module;
