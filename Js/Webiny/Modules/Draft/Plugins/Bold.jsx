import Webiny from 'Webiny';
import InlineStylePlugin from './../BasePlugins/InlineStylePlugin';
const Ui = Webiny.Ui.Components;

class BoldPlugin extends InlineStylePlugin {
    constructor(config) {
        super(config);
        this.name = 'bold';
        this.style = 'BOLD';
    }

    getEditConfig() {
        return {
            toolbar: <Ui.Draft.Toolbar.InlineStyle icon="fa-bold" plugin={this}/>,
            handleKeyCommand: (command) => {
                if (command === 'bold' && this.editor.getEditorState().getSelection().isCollapsed()) {
                    return true;
                }
            }
        };
    }
}

export default BoldPlugin;