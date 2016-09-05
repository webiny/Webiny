import Webiny from 'Webiny';
import PasswordContainer from './PasswordContainer';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Password = PasswordContainer;
    }
}

export default Module;
