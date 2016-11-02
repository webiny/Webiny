
export default (config) => {
    let render = {};
    let renderIndex = {};
    return {
        name: 'syntax-highlight',
        decorators: [
            {
                strategy: (contentBlock, callback) => {
                    const blockData = contentBlock.getData().toJS();

                    let offset = 0;
                    const blockKey = contentBlock.getKey();
                    render[blockKey] = [];
                    renderIndex[contentBlock.getKey()] = 0;

                    let parentToken = null;
                    const parseToken = (token) => {
                        if (_.isArray(token.content)) {
                            parentToken = token;
                            token.content.map(parseToken);
                            parentToken = null;
                        } else {
                            render[blockKey].push(_.isString(token) ? {type: _.get(parentToken, 'type', ''), value: token} : token);
                            const length = typeof token === 'string' ? token.length : token.content.length;
                            callback(offset, offset + length);
                            offset += length;
                        }
                    };

                    const tokens = Prism.tokenize(contentBlock.getText(), Prism.languages[config.language]);
                    tokens.map(parseToken);
                },
                component: (props) => {
                    const blockKey = props.children[0].props.blockKey;
                    const index = renderIndex[blockKey];
                    if (index + 1 > render[blockKey].length) {
                        renderIndex[blockKey] = 0;
                    }

                    const token = render[blockKey][renderIndex[blockKey]];
                    renderIndex[blockKey]++;

                    if (_.has(token, 'type')) {
                        return React.createElement('span', {className: 'prism-token token ' + token.type}, props.children);
                    }
                    return props.children[0];
                }
            }
        ],

        handlePastedText: (text, html, editor) => {
            const editorState = editor.getEditorState();
            const contentState = editorState.getCurrentContent();
            const selection = editorState.getSelection();
            let newContentState = null;
            if (selection.isCollapsed()) {
                newContentState = Draft.Modifier.insertText(contentState, selection, text);
            } else {
                newContentState = Draft.Modifier.replaceText(contentState, selection, text);
            }
            editor.setEditorState(Draft.EditorState.push(editorState, newContentState, 'pasted-text'));
            return true;
        },

        onTab: (e, editor) => {
            const editorState = editor.getEditorState();
            editor.setEditorState(DraftCodeBlock.handleTab(e, editorState));
            return true;
        }
    };
}