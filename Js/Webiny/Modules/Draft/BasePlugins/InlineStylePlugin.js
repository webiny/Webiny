import Webiny from 'Webiny';
import BasePlugin from './BasePlugin';
import Utils from './../Utils';

class InlineStylePlugin extends BasePlugin {
    constructor() {
        super();
        this.style = '';
    }

    toggleStyle() {
        const editorState = this.editor.getEditorState();
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        if (this.isActive() && selection.isCollapsed()) {
            let newEntityState = contentState;
            // Find relevant styles and remove them
            contentState.getBlockForKey(selection.getAnchorKey()).findStyleRanges(c => c.style.has(this.style), (start, end) => {
                if (start < selection.getAnchorOffset() && end > selection.getAnchorOffset()) {
                    const inlineStyleRange = new Draft.SelectionState({
                        anchorOffset: start,
                        anchorKey: selection.getAnchorKey(),
                        focusOffset: end,
                        focusKey: selection.getAnchorKey(),
                        isBackward: false,
                        hasFocus: selection.getHasFocus()
                    });
                    newEntityState = Draft.Modifier.removeInlineStyle(editorState.getCurrentContent(), inlineStyleRange, this.style);
                }
            });
            this.editor.setEditorState(Draft.EditorState.createWithContent(newEntityState, this.editor.getDecorators()));
        } else {
            this.editor.setEditorState(Draft.RichUtils.toggleInlineStyle(editorState, this.style));
        }
    }

    isActive() {
        if (this.editor.getReadOnly()) {
            return false;
        }
        const editorState = this.editor.getEditorState();
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();

        if (selection.isCollapsed()) {
            const blockKey = selection.getStartKey();
            return contentState.getBlockForKey(blockKey).getInlineStyleAt(selection.getAnchorOffset()).has(this.style);
        }

        return editorState.getCurrentInlineStyle().has(this.style);
    }
}

export default InlineStylePlugin;