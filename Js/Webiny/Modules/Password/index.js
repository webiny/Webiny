import Webiny from 'Webiny';
import Password from './Password';

class Module extends Webiny.Module {

    init() {
        this.name = 'Password';
        Webiny.Ui.Components.Password = Password;
    }
}

export default Module;
