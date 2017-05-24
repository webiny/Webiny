import Webiny from 'Webiny';
import InlineStylePlugin from './../BasePlugins/InlineStylePlugin';
const Ui = Webiny.Ui.Components;

class UnderlinePlugin extends InlineStylePlugin {
    constructor(config) {
        super(config);
        this.name = 'bold';
        this.style = 'UNDERLINE';
    }

    getEditConfig() {
        return {
            toolbar: <Ui.Draft.Toolbar.InlineStyle icon="fa-underline" plugin={this}/>,
            handleKeyCommand: (command, editor) => {
                if (command === 'underline' && editor.getEditorState().getSelection().isCollapsed()) {
                    return true;
                }
            }
        };
    }
}

export default UnderlinePlugin;