import Webiny from 'Webiny';
import TextareaContainer from './TextareaContainer';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Textarea = TextareaContainer;
    }
}

export default Module;
