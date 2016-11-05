import Webiny from 'Webiny';

class BasePlugin {
    constructor(config = {}) {
        this.name = '';
        this.config = config;
        this.editor = null;
    }

    ui(call, ...params) {
        if (call.indexOf(':') < 0) {
            return Webiny.Ui.Dispatcher.get(call);
        }
        return Webiny.Ui.Dispatcher.createSignal(this, call, params);
    }

    getStartBlockType(defaultValue = null) {
        const editorState = this.editor.getEditorState();
        const selection = editorState.getSelection();
        const block = editorState.getCurrentContent().getBlockForKey(selection.getStartKey());
        if (block) {
            return block.getType();
        }
        return defaultValue;
    }

    getStartBlock() {
        const editorState = this.editor.getEditorState();
        const selection = editorState.getSelection();
        const block = editorState.getCurrentContent().getBlockForKey(selection.getStartKey());
        return block || null;
    }

    isDisabled() {
        return this.editor.getReadOnly();
    }

    setConfig(config) {
        _.merge(this.config, config);
        return this;
    }

    setEditor(editor) {
        this.editor = editor;
        return this;
    }

    getEditConfig() {
        return _.clone({});
    }

    getPreviewConfig() {
        return _.clone(this.getEditConfig());
    }
}

export default BasePlugin;