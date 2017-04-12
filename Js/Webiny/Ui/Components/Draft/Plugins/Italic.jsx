import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import InlineStylePlugin from './../BasePlugins/InlineStylePlugin';

class ItalicPlugin extends InlineStylePlugin {
    constructor(config) {
        super(config);
        this.name = 'bold';
        this.style = 'ITALIC';
    }

    getEditConfig() {
        return {
            toolbar: <Ui.Draft.Toolbar.InlineStyle icon="fa-italic" plugin={this}/>,
            handleKeyCommand: (command, editor) => {
                if (command === 'italic' && editor.getEditorState().getSelection().isCollapsed()) {
                    return true;
                }
            }
        };
    }
}

export default ItalicPlugin;