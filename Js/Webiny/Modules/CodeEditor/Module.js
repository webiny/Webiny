import Webiny from 'Webiny';
import CodeEditor from './CodeEditor';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.CodeEditor = CodeEditor;
    }
}

export default Module;
