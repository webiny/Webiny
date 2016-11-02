// CREATE ENTITY
function createEntity(){
    const editorState = this.props.editor.getEditorState();
    const selection = editorState.getSelection();

    // Create a new entity
    const entityKey = Entity.create('QUOTE', 'MUTABLE');
    let newContentState = Draft.Modifier.applyEntity(editorState.getCurrentContent(), selection, entityKey);

    // Insert a space at the end of current selection
    const blockKey = selection.getFocusKey();
    const end = selection.getIsBackward() ? selection.getAnchorOffset() : selection.getFocusOffset();
    const newSelection = new Draft.SelectionState({
        anchorOffset: end + 1,
        anchorKey: blockKey,
        focusOffset: end + 1,
        focusKey: blockKey,
        isBackward: false,
        hasFocus: selection.getHasFocus()
    });
    newContentState = Draft.Modifier.insertText(newContentState, newSelection, ' ');

    // Create new editor state from content state
    const newEditorState = Draft.EditorState.createWithContent(newContentState, this.props.editor.getDecorators());
    this.props.editor.setEditorState(newEditorState);
}
