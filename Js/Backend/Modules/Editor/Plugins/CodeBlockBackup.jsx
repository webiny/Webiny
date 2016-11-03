import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import BlockTypePlugin from './BlockTypePlugin';

const addContentBlock = (editorState) => {
    const newBlock = new Draft.ContentBlock({
        key: Draft.genKey(),
        type: 'unstyled',
        text: '',
        characterList: Immutable.List()
    });

    const contentState = editorState.getCurrentContent();
    const newBlockMap = contentState.getBlockMap().set(newBlock.key, newBlock);

    const newSelection = new Draft.SelectionState({
        anchorOffset: 0,
        anchorKey: newBlock.key,
        focusOffset: 0,
        focusKey: newBlock.key,
        isBackward: false,
        hasFocus: true
    });

    // TODO: force the new block to be inserted immediately after current selection block and not at the end of the editor

    let newContentState = Draft.ContentState.createFromBlockArray(newBlockMap.toArray());
    newContentState = newContentState.set('selectionBefore', contentState.getSelectionBefore());
    newContentState = newContentState.set('selectionAfter', newSelection);
    return Draft.EditorState.push(editorState, newContentState);
};

class CodeBlockComponent extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.state = {
            language: '',
            lines: null,
            code: null
        };

        this.mainBlock = null;

        this.bindMethods('parseCode', 'switchLanguage', 'preventEvents');
        console.log(props);
    }

    componentDidMount() {
        super.componentDidMount();
        this.parseCode(this.props);
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.parseCode(props);
    }

    parseCode(props) {
        let lines = [];
        const blockKey = _.trimStart(React.Children.toArray(props.children)[0].key, '.$');
        this.mainBlock = props.getEditor().getEditorState().getCurrentContent().getBlockForKey(blockKey);
        this.setState({language: this.mainBlock.getData().toJS().language || 'jsx'});

        React.Children.map(props.children, child => {
            const block = React.Children.toArray(child.props.children)[0].props.block;
            lines.push(block.getText());
        });

        lines = lines.join('');
        if (this.state.lines === lines) {
            return;
        }

        let code = null;
        try {
            code = eval(Babel.transform(lines, {presets: ['react', 'es2015']}).code);
            if (code !== this.state.code) {
                this.setState({code, key: _.uniqueId('code-')});
            }
        } catch (e) {
            // console.error('BABEL ERROR', e.message)
        }
    }

    switchLanguage(language) {
        this.props.getEditor().updateBlockData(this.mainBlock, {language});
    }

    preventEvents() {
        return {
            onMouseDown: () => this.props.getEditor().setReadOnly(true),
            onClick: e => e.stopPropagation()
        };
    }
}

CodeBlockComponent.defaultProps = {
    renderer(){
        return (
            <Ui.Grid.Row>
                <Ui.Grid.Col all={6}>
                    <div {...this.preventEvents()} style={{position: 'absolute', right: 20, top: 5}}>
                        <Ui.Dropdown title={this.state.language} className="balloon">
                            <Ui.Dropdown.Header title="Language"/>
                            <Ui.Dropdown.Link title="HTML" onClick={() => this.switchLanguage('html')}/>
                            <Ui.Dropdown.Link title="JSX" onClick={() => this.switchLanguage('jsx')}/>
                            <Ui.Dropdown.Link title="PHP" onClick={() => this.switchLanguage('php')}/>
                        </Ui.Dropdown>
                    </div>
                    <pre>{this.props.children}</pre>
                </Ui.Grid.Col>
                <Ui.Hide if={!React.isValidElement(this.state.code)}>
                    <Ui.Grid.Col all={6}>
                        <div className="component-plugin-wrapper" {...this.preventEvents()}>
                            <Ui.Form key={this.state.key}>
                                {(model) => (
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={6}>
                                            {React.isValidElement(this.state.code) && this.state.code}
                                        </Ui.Grid.Col>
                                        <Ui.Hide if={React.isValidElement(this.state.code) && !_.has(this.state.code.props, 'name')}>
                                            <Ui.Grid.Col all={6}>
                                                Form model:
                                                <pre>{JSON.stringify(model, null, 4)}</pre>
                                            </Ui.Grid.Col>
                                        </Ui.Hide>
                                    </Ui.Grid.Row>
                                )}
                            </Ui.Form>
                        </div>
                    </Ui.Grid.Col>
                </Ui.Hide>
            </Ui.Grid.Row>
        );
    }
};

export default () => {
    let render = {};
    let renderIndex = {};
    const plugin = {
        name: 'code-block',
        toolbar: <BlockTypePlugin icon="fa-code" block="code-block"/>,
        blockRenderMap: {
            'code-block': {
                element: 'code',
                wrapper: <CodeBlockComponent getEditor={() => plugin.editor}/>
            }
        },
        decorators: [
            {
                strategy: (contentBlock, callback) => {
                    if (contentBlock.getType() !== 'code-block') {
                        return;
                    }

                    const blockData = contentBlock.getData().toJS();
                    console.log(contentBlock);

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

                    console.log('USE LANGUAGE', blockData.language || 'jsx');
                    const tokens = Prism.tokenize(contentBlock.getText(), Prism.languages[blockData.language || 'jsx']);
                    tokens.map(parseToken);
                },
                component: (props) => {
                    const blockKey = props.children[0].props.blockKey;
                    const token = render[blockKey][renderIndex[blockKey]];
                    renderIndex[blockKey]++;

                    if (_.has(token, 'type')) {
                        return React.createElement('span', {className: 'prism-token token ' + token.type}, props.children);
                    }

                    return props.children[0];
                }
            }
        ],
        handleKeyCommand: (command, editor) => {
            const editorState = editor.getEditorState();
            if (DraftCodeBlock.hasSelectionInBlock(editorState)) {
                editor.setEditorState(DraftCodeBlock.handleKeyCommand(editorState, command));
                return true;
            }
        },
        keyBindingFn: (e, editor) => {
            const editorState = editor.getEditorState();

            let command = null;
            if (DraftCodeBlock.hasSelectionInBlock(editorState)) {
                command = DraftCodeBlock.getKeyBinding(e);
            }

            if (command) {
                return command;
            }
        },

        handleReturn: (e, editor) => {
            const editorState = editor.getEditorState();
            if (DraftCodeBlock.hasSelectionInBlock(editorState)) {
                if (editorState.getSelection().isCollapsed() && Draft.KeyBindingUtil.hasCommandModifier(e)) {
                    editor.setEditorState(addContentBlock(editorState));
                    return true;
                }
            }
        },

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
            if (DraftCodeBlock.hasSelectionInBlock(editorState)) {
                editor.setEditorState(DraftCodeBlock.handleTab(e, editorState));
                return true;
            }
        }
    };

    return plugin;
}