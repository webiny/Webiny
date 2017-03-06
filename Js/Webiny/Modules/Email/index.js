import Webiny from 'Webiny';
import Email from './Email';

class Module extends Webiny.Module {

    init() {
        this.name = 'Email';
        Webiny.Ui.Components.Email = Email;
    }
}

export default Module;
