import Webiny from 'Webiny';
import CodeEditor from './CodeEditor';
import SimpleCodeEditor from './SimpleCodeEditor';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.CodeEditor = CodeEditor;
        Webiny.Ui.Components.SimpleCodeEditor = SimpleCodeEditor;
    }
}

export default Module;
