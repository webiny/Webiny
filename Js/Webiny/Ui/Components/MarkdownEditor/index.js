import Webiny from 'Webiny';
import MarkdownEditor from './MarkdownEditor';

class Module extends Webiny.Module {

    init() {
        this.name = 'MarkdownEditor';
        Webiny.Ui.Components.MarkdownEditor = MarkdownEditor;
        () => import('Webiny/Ui/MarkdownEditor');
    }
}

export default Module;
