import InlineStylePlugin from './InlineStylePlugin';

export default () => {
    return {
        name: 'italic',
        toolbar: <InlineStylePlugin icon="fa-italic" style="ITALIC"/>,
        handleKeyCommand: (command, editor) => {
            if (command === 'italic' && editor.getEditorState().getSelection().isCollapsed()) {
                return true;
            }
        }
    };
}