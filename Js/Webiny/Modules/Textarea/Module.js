import Webiny from 'Webiny';
import TextareaContainer from './TextareaContainer';
import Textarea from './Textarea';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Textarea = TextareaContainer;
        Webiny.Ui.Components.SimpleTextarea = Textarea;
    }
}

export default Module;
