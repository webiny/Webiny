import Webiny from 'Webiny';
import Gravatar from './Gravatar';

class Module extends Webiny.Module {

    init() {
        this.name = 'Gravatar';
        Webiny.Ui.Components.Gravatar = Gravatar;
    }
}

export default Module;
