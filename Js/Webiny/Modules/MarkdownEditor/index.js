import Webiny from 'Webiny';
import MarkdownEditor from './MarkdownEditor';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.MarkdownEditor = MarkdownEditor;
    }
}

export default Module;
