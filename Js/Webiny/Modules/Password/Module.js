import Webiny from 'Webiny';
import Password from './Password';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Password = Password;
    }
}

export default Module;
