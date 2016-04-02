import Webiny from 'Webiny';
import Textarea from './Textarea';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Textarea = Textarea;
    }
}

export default Module;
