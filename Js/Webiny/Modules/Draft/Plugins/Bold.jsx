import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import InlineStylePlugin from './../BasePlugins/InlineStylePlugin';

class BoldPlugin extends InlineStylePlugin {
    constructor(config) {
        super(config);
        this.name = 'bold';
        this.style = 'BOLD';
    }

    getEditConfig() {
        return _.merge(super.getEditConfig(), {
            toolbar: <Ui.Draft.Toolbar.InlineStyle icon="fa-bold" plugin={this}/>,
            handleKeyCommand: (command) => {
                if (command === 'bold' && this.editor.getEditorState().getSelection().isCollapsed()) {
                    return true;
                }
            }
        });
    }
}

export default BoldPlugin;