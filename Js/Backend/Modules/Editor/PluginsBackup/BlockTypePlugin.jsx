import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class BlockType extends Webiny.Ui.Component {
    toggleBlockType() {
        const editorState = this.props.editor.getEditorState();
        this.props.editor.setEditorState(Draft.RichUtils.toggleBlockType(editorState, this.props.block));
    }

    isActive() {
        const editorState = this.props.editor.getEditorState();
        const selection = editorState.getSelection();
        return this.props.block === editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
    }
}

BlockType.defaultProps = {
    renderer(){
        const isActive = this.isActive.call(this);
        return (
            <Ui.Button disabled={this.props.editor.getReadOnly()} type={isActive ? 'primary' : 'default'} onClick={this.toggleBlockType.bind(this)} icon={this.props.icon}/>
        );
    }
};

export default BlockType;