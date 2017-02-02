import Webiny from 'Webiny';
import Gravatar from './Gravatar';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Gravatar = Gravatar;
    }
}

export default Module;
