import Webiny from 'Webiny';
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

    removeEntity() {
        const editorState = this.editor.getEditorState();
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const entityKey = Utils.getEntityKeyForSelection(contentState, selection);
        const entitySelectionState = Utils.getEntitySelectionState(contentState, selection, entityKey);
        this.editor.setEditorState(Draft.RichUtils.toggleLink(editorState, entitySelectionState, null));
    }

    insertEntity(entityKey) {
        const editorState = this.editor.getEditorState();
        const selection = editorState.getSelection();
        let newContentState = Draft.Modifier.applyEntity(editorState.getCurrentContent(), selection, entityKey);
        this.editor.setEditorState(Draft.EditorState.push(editorState, newContentState, 'apply-entity'));
    }

    isActive() {
        if (this.editor.getReadOnly()) {
            return false;
        }

        const editorState = this.editor.getEditorState();
        const entityKey = Utils.getEntityKeyForSelection(editorState.getCurrentContent(), editorState.getSelection());
        return entityKey && Draft.Entity.get(entityKey).getType().toUpperCase() === this.entity.toUpperCase();
    }
}

export default EntityPlugin;