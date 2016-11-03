import Webiny from 'Webiny';

class BoldPlugin extends Webiny.Draft.Plugin {
    constructor(props) {
        super(props);
        this.name = 'bold';
    }

    getEditConfig() {
        return {
            toolbar: <Webiny.Draft.Toolbar.InlineStyle icon="fa-bold" style="BOLD"/>,
            handleKeyCommand: (command) => {
                if (command === 'bold' && this.editor.getEditorState().getSelection().isCollapsed()) {
                    return true;
                }
            }
        };
    }
}

export default BoldPlugin;