import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const {Entity, RichUtils} = Draft;
import DraftUtils from './../DraftUtils';

class CodeEditorComponent extends Webiny.Ui.Component {

}

CodeEditorComponent.defaultProps = {
    renderer() {

    }
};

class CodeEditorAction extends Webiny.Ui.Component {
    getCodeEditor() {
        const editorState = this.props.editor.getEditorState();
        this.props.editor.setEditorState(DraftUtils.insertDataBlock(editorState, {url, plugin: 'code-editor'}));
    }
}

CodeEditorAction.defaultProps = {
    renderer(){
        return (
            <Ui.Button disabled={this.props.editor.getReadOnly()} onClick={this.getCodeEditor.bind(this)} icon="fa-picture-o"/>
        );
    }
};

export default () => {
    const id = _.uniqueId('image-plugin-');
    return {
        name: 'image',
        toolbar: <CodeEditorAction ui={id}/>,
        blockRendererFn: (contentBlock) => {
            const type = contentBlock.getType();
            const dataType = contentBlock.getData().toObject().plugin;
            if (type === 'atomic' && dataType === 'image') {
                return {
                    component: CodeEditorComponent
                };
            }
        },
        handleKeyCommand: (command) => {
            if (command === 'insert-image') {
                Webiny.Ui.Dispatcher.get(id).getCodeEditor();
                return true;
            }
        },

        keyBindingFn: (e) => {
            // Alt+Shift+I
            if (e.keyCode === 73 && Draft.KeyBindingUtil.isOptionKeyCommand(e)) {
                return 'insert-image';
            }
        }
    };
}