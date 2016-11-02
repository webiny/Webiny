import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import InlineStylePlugin from './../BasePlugins/InlineStylePlugin';

class UnderlinePlugin extends InlineStylePlugin {
    constructor(config) {
        super(config);
        this.name = 'bold';
        this.style = 'UNDERLINE';
    }

    getEditConfig() {
        return _.merge(super.getEditConfig(), {
            toolbar: <Ui.Draft.Toolbar.InlineStyle icon="fa-underline" plugin={this}/>,
            handleKeyCommand: (command, editor) => {
                if (command === 'underline' && editor.getEditorState().getSelection().isCollapsed()) {
                    return true;
                }
            }
        });
    }
}

export default UnderlinePlugin;