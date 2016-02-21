import Webiny from 'Webiny';
import Placeholder from './Placeholder';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Placeholder = Placeholder;
    }
}

export default Module;
