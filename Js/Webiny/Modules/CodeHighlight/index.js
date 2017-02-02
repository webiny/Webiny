import Webiny from 'Webiny';
import CodeHighlight from './CodeHighlight';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.CodeHighlight = CodeHighlight;
    }
}

export default Module;
