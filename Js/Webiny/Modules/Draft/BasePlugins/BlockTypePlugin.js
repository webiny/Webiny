import Webiny from 'Webiny';
import BasePlugin from './BasePlugin';
import Utils from './../Utils';

class BlockTypePlugin extends BasePlugin {
    constructor() {
        super();
        this.block = '';
    }

    toggleBlockType() {
        const editorState = this.editor.getEditorState();
        this.editor.setEditorState(Draft.RichUtils.toggleBlockType(editorState, this.block));
    }

    isActive() {
        if (this.editor.getReadOnly()) {
            return false;
        }
        return this.block === this.getStartBlockType();
    }
}

export default BlockTypePlugin;