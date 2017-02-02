import Webiny from 'Webiny';
import SimpleTextarea from './SimpleTextarea';
import Textarea from './Textarea';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Textarea = Textarea;
        Webiny.Ui.Components.SimpleTextarea = SimpleTextarea;
    }
}

export default Module;
