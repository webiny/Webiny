import Webiny from 'Webiny';
import CodeHighlight from './CodeHighlight';

class Module extends Webiny.Module {

    init() {
        this.name = 'CodeHighlight';
        Webiny.Ui.Components.CodeHighlight = CodeHighlight;
    }
}

export default Module;
