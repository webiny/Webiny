import Webiny from 'Webiny';
import Email from './Email';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Email = Email;
    }
}

export default Module;
