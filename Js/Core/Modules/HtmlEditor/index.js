import Webiny from 'Webiny';
import HtmlEditor from './HtmlEditor';

class Module extends Webiny.Module {

    init() {
        this.name = 'HtmlEditor';
        Webiny.Ui.Components.HtmlEditor = HtmlEditor;
    }
}

export default Module;
