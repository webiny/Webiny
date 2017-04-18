import BasePlugin from './BasePlugin';
import Utils from './../Utils';

class EntityPlugin extends BasePlugin {
    constructor() {
        super();
        this.entity = '';
    }

    createEntity() {
        throw Error('Implement "createEntity" method in your plugin class!');
    }

    setEntity() {
        const editorState = this.editor.getEditorState();
        const selection = editorState.getSelection();
        if (selection.isCollapsed()) {
            return;
        }

        // Create a new entity
        this.createEntity();
    }

    async removeEntity() {
        const editorState = this.editor.getEditorState();
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const entityKey = Utils.getEntityKeyForSelection(contentState, selection);
        const entitySelectionState = Utils.getEntitySelectionState(contentState, selection, entityKey);
        const Draft = await this.getDraft();
        this.editor.setEditorState(Draft.RichUtils.toggleLink(editorState, entitySelectionState, null));
    }

    async insertEntity(newContentState, entityKey) {
        const editorState = this.editor.getEditorState();
        const selection = editorState.getSelection();
        const Draft = await this.getDraft();
        newContentState = Draft.Modifier.applyEntity(newContentState, selection, entityKey);
        this.editor.setEditorState(Draft.EditorState.push(editorState, newContentState, 'apply-entity'));
    }

    isActive() {
        if (this.editor.getReadOnly()) {
            return false;
        }

        const editorState = this.editor.getEditorState();
        const contentState = editorState.getCurrentContent();
        const entityKey = Utils.getEntityKeyForSelection(contentState, editorState.getSelection());
        return entityKey && contentState.getEntity(entityKey).getType().toUpperCase() === this.entity.toUpperCase();
    }
}

export default EntityPlugin;