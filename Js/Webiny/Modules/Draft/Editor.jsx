import Webiny from 'Webiny';
import PluginsContainer from './PluginsContainer';
const Ui = Webiny.Ui.Components;

class Editor extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.bindMethods('initialize', 'focus', 'onChange', 'getEditorState', 'setReadOnly');

        this.plugins = new PluginsContainer(props.plugins, this.getEditorMethods());

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
            this.plugins.setPreview(props.preview);
            return this.setState({
                readOnly: props.preview,
                editorState: Draft.EditorState.createWithContent(this.state.editorState.getCurrentContent(), this.plugins.getDecorators())
            }, this.forceRerender);
        }

        return this.setState({
            readOnly: props.preview ? true : props.readOnly
        });
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
            setPluginConfig: (name, config) => this.plugins.getPlugin(name).setConfig(config),
            getReadOnly: () => this.state.readOnly,
            getDecorators: () => this.plugins.getDecorators(),
            getPreview: () => this.props.preview,
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

Editor.defaultProps = {
    value: null,
    plugins: [],
    preview: false,
    readOnly: false,
    renderer() {
        const {editorState} = this.state;
        if (!editorState) {
            return null;
        }

        this.plugins.setPreview(this.props.preview);

        return (
            <div className="rich-editor rich-editor__root" onMouseDown={this.focus}>
                <Toolbar readOnly={this.state.readOnly} plugins={this.plugins} editorMethods={this.getEditorMethods()}/>

                <div className={this.classSet(this.props.className, 'rich-editor__editor')}>
                    <Draft.Editor
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
            {props.plugins.getToolbarActions().map((action, i) => {
                return (
                    <span key={i} className="toolbar-action">
                        {React.cloneElement(action, {editor: props.editorMethods})}
                    </span>
                );
            })}
        </div>
    );
};

export default Editor;

// Bold, Italic, Headings, quote (blockquote), unordered list, ordered list, link, image