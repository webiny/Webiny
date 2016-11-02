import Webiny from 'Webiny';
import DraftUtils from './../DraftUtils';
const Ui = Webiny.Ui.Components;

class InlineStylePlugin extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.bindMethods('isActive', 'isEnabled');
    }

    isEnabled() {
        const editorState = this.props.editor.getEditorState();
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        if (contentState.getBlockForKey(selection.getAnchorKey()).getType() === 'code-block') {
            return false;
        }
        return true;
    }

    toggleStyle() {
        const editorState = this.props.editor.getEditorState();
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        if (this.isActive() && selection.isCollapsed()) {
            let newEntityState = contentState;
            // Find relevant styles and remove them
            contentState.getBlockForKey(selection.getAnchorKey()).findStyleRanges(c => c.style.has(this.props.style), (start, end) => {
                if (start < selection.getAnchorOffset() && end > selection.getAnchorOffset()) {
                    const inlineStyleRange = new Draft.SelectionState({
                        anchorOffset: start,
                        anchorKey: selection.getAnchorKey(),
                        focusOffset: end,
                        focusKey: selection.getAnchorKey(),
                        isBackward: false,
                        hasFocus: selection.getHasFocus()
                    });
                    newEntityState = Draft.Modifier.removeInlineStyle(editorState.getCurrentContent(), inlineStyleRange, this.props.style);
                }
            });
            this.props.editor.setEditorState(Draft.EditorState.createWithContent(newEntityState, this.props.editor.getDecorators()));
        } else {
            this.props.editor.setEditorState(Draft.RichUtils.toggleInlineStyle(editorState, this.props.style));
        }
    }

    isActive() {
        if (!this.isEnabled()) {
            return false;
        }

        const editorState = this.props.editor.getEditorState();
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();

        if (selection.isCollapsed()) {
            const blockKey = selection.getStartKey();
            return contentState.getBlockForKey(blockKey).getInlineStyleAt(selection.getAnchorOffset()).has(this.props.style);
        }

        return editorState.getCurrentInlineStyle().has(this.props.style);
    }
}

InlineStylePlugin.defaultProps = {
    renderer(){
        return (
            <Ui.Button
                disabled={this.props.editor.getReadOnly() || !this.isEnabled()}
                type={this.isActive() ? 'primary' : 'default'}
                onClick={this.toggleStyle.bind(this)}
                icon={this.props.icon}/>
        );
    }
};

export default InlineStylePlugin;