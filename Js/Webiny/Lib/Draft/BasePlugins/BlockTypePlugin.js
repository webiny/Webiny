import BasePlugin from './BasePlugin';

class BlockTypePlugin extends BasePlugin {
    constructor() {
        super();
        this.block = '';
    }

    toggleBlockType() {
        const editorState = this.editor.getEditorState();
        this.getDraft().then(Draft => {
            this.editor.setEditorState(Draft.RichUtils.toggleBlockType(editorState, this.block));
        });
    }

    isActive() {
        if (this.editor.getReadOnly()) {
            return false;
        }
        return this.block === this.getStartBlockType();
    }
}

export default BlockTypePlugin;