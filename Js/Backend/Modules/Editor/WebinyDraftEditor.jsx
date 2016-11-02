import Webiny from 'Webiny';
import PluginsContainer from './PluginsContainer';
const Ui = Webiny.Ui.Components;
const {Editor} = Draft;

class WebinyDraftEditor extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.bindMethods('initialize', 'focus', 'onChange', 'getEditorState', 'setReadOnly', 'setPlugins');

        this.setPlugins(props, true);

        this.state = {
            readOnly: props.readOnly,
            editorState: this.initialize(props)
        };
    }

    initialize(props) {
        let editorState = null;
        if (!props.value) {
            editorState = Draft.EditorState.createEmpty(this.plugins.getDecorators());
        }

        if (props.value) {
            if (_.isPlainObject(props.value)) {
                editorState = Draft.EditorState.createWithContent(Draft.convertFromRaw(props.value), this.plugins.getDecorators());
            } else {
                editorState = props.value;
            }
        }

        return editorState;
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        const editorState = this.initialize(props);
        if (editorState) {
            this.setState({editorState});
        }

        if (props.preview !== this.props.preview) {
            this.plugins = props.preview ? this.renderPlugins : this.editPlugins;
            return this.setState({
                readOnly: props.preview,
                editorState: Draft.EditorState.createWithContent(this.state.editorState.getCurrentContent(), this.plugins.getDecorators())
            });
        }

        return this.setState({
            readOnly: props.preview ? true : props.readOnly
        });
    }

    setPlugins(props) {
        this.editPlugins = new PluginsContainer(props.editPlugins, this.getEditorMethods());
        this.renderPlugins = new PluginsContainer(props.renderPlugins, this.getEditorMethods());
        this.plugins = props.preview ? this.renderPlugins : this.editPlugins;
    }

    forceRerender() {
        const {editorState} = this.state;
        const content = editorState.getCurrentContent();
        const newEditorState = Draft.EditorState.createWithContent(content, this.plugins.getDecorators());
        this.setState({editorState: newEditorState});
    }

    focus() {
        if (!this.state.preview) {
            this.setReadOnly(false);
        }

        setTimeout(() => {
            if (this.refs.editor) {
                this.refs.editor.focus();
            }
        });
    }

    onChange(editorState) {
        //this.setState({editorState}, this.focus);
        this.props.onChange(editorState);
    }

    getEditorState() {
        return this.state.editorState;
    }

    setReadOnly(readOnly) {
        if (!this.props.preview) {
            this.setState({readOnly});
        }
    }

    getEditorMethods() {
        return {
            getEditorState: this.getEditorState,
            setEditorState: this.onChange,
            setReadOnly: this.setReadOnly,
            getReadOnly: () => this.state.readOnly,
            getDecorators: () => this.plugins.getDecorators(),
            updateBlockData: (block, data) => {
                const {editorState} = this.state;
                const selection = new Draft.SelectionState({
                    anchorKey: block.getKey(),
                    anchorOffset: 0,
                    focusKey: block.getKey(),
                    focusOffset: block.getLength()
                });

                const newContentState = Draft.Modifier.mergeBlockData(editorState.getCurrentContent(), selection, Immutable.Map(data || {}));
                const newEditorState = Draft.EditorState.push(editorState, newContentState);

                this.onChange(newEditorState);
            }
        };
    }
}

WebinyDraftEditor.defaultProps = {
    value: null,
    editPlugins: [],
    renderPlugins: [],
    preview: false,
    readOnly: false,
    renderer() {
        const {editorState} = this.state;
        if (!editorState) {
            return null;
        }

        return (
            <div className="rich-editor rich-editor__root">
                <Toolbar readOnly={this.state.readOnly} plugins={this.props.editPlugins} editorMethods={this.getEditorMethods()}/>

                <div className="rich-editor__editor" onClick={this.focus}>
                    <Editor
                        blockRenderMap={this.plugins.getBlockRenderMap()}
                        blockRendererFn={this.plugins.getBlockRendererFn()}
                        blockStyleFn={this.plugins.getBlockStyleFn()}
                        customStyleMap={this.plugins.getCustomStyleMap()}
                        handleKeyCommand={this.plugins.getHandleKeyCommandFn()}
                        keyBindingFn={this.plugins.getKeyBindingFn()}
                        handleReturn={this.plugins.getHandleReturnFn()}
                        handlePastedText={this.plugins.getHandlePastedTextFn()}
                        //
                        ref="editor"
                        readOnly={this.state.readOnly}
                        editorState={editorState}
                        onChange={this.onChange}
                        onTab={this.plugins.getOnTabFn()}
                        placeholder={this.props.placeholder}
                        spellCheck={true}/>
                </div>
            </div>
        );
    }
};

const Toolbar = (props) => {
    return (
        <div className="editor-toolbar">
            {props.plugins.map(plugin => {
                if (!plugin || !plugin.toolbar) {
                    return null;
                }

                return (
                    <span key={plugin.name} className="toolbar-action">
                        {React.cloneElement(plugin.toolbar, {editor: props.editorMethods})}
                    </span>
                );
            })}
        </div>
    );
};

export default WebinyDraftEditor;

// Bold, Italic, Headings, quote (blockquote), unordered list, ordered list, link, image