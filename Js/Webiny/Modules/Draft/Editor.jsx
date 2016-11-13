import Webiny from 'Webiny';
import Utils from './Utils';
import PluginsContainer from './PluginsContainer';
import Toolbar from './Toolbar';
import FloatingToolbar from './FloatingToolbar';
import CustomViews from './CustomViews';
const Ui = Webiny.Ui.Components;

class Editor extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.bindMethods('initialize', 'focus', 'onChange', 'getEditorState', 'setReadOnly', 'moveFocusToEnd');

        this.plugins = new PluginsContainer(props.plugins, this.getEditorMethods());

        this.state = {
            readOnly: props.preview || props.readOnly,
            editorState: Draft.EditorState.createEmpty(this.plugins.getDecorators())
        };

        this.state.editorState = this.initialize(props);
    }

    initialize(props) {
        if (_.isPlainObject(props.value) && _.has(props.value, 'blocks')) {
            const newEditorState = Draft.EditorState.createWithContent(Draft.convertFromRaw(props.value), this.plugins.getDecorators());
            return Draft.EditorState.forceSelection(newEditorState, this.state.editorState.getSelection());
        }

        return this.state.editorState;
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        if (!_.has(this.props.value, 'blocks')) {
            const editorState = this.initialize(props);
            if (editorState) {
                this.setState({editorState});
            }
        }

        if (props.preview !== this.props.preview) {
            this.plugins.setPreview(props.preview);
            return this.setState({readOnly: props.preview}, this.forceRerender);
        }
    }

    moveFocusToEnd() {
        this.setState({editorState: Draft.EditorState.moveFocusToEnd(this.state.editorState)});
    }

    forceRerender() {
        if (!this.state) {
            return;
        }
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
        }, 50);
    }

    onChange(editorState = null) {
        clearTimeout(this.delay);
        this.delay = null;
        this.delay = setTimeout(() => {
            this.props.onChange(this.props.convertToRaw ? Draft.convertToRaw(editorState.getCurrentContent()) : editorState)
        }, this.props.delay);
        this.setState({editorState});
    }

    getEditorState() {
        return this.state.editorState || null;
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
            getReadOnly: () => _.get(this.state, 'readOnly', this.props.readOnly),
            getDecorators: () => this.plugins.getDecorators(),
            getPreview: () => this.props.preview,
            forceRerender: this.forceRerender,
            updateBlockData: (block, data) => {
                const {editorState} = this.state;
                const selection = new Draft.SelectionState({
                    anchorKey: block.getKey(),
                    anchorOffset: 0,
                    focusKey: block.getKey(),
                    focusOffset: block.getLength()
                });

                const newContentState = Draft.Modifier.mergeBlockData(editorState.getCurrentContent(), selection, Immutable.Map(data || {}));
                const newEditorState = Draft.EditorState.push(editorState, newContentState, 'change-block-data');

                this.onChange(newEditorState);
            }
        };
    }
}

Editor.defaultProps = {
    delay: 400,
    value: null,
    convertToRaw: true,
    plugins: [],
    preview: false,
    readOnly: false,
    toolbar: true,
    onChange: _.noop,
    renderer() {
        const {editorState} = this.state;
        if (!editorState) {
            return null;
        }

        let toolbar = null;
        if (this.props.toolbar === true) {
            toolbar = <Toolbar readOnly={this.state.readOnly} plugins={this.plugins}/>;
        }

        if (this.props.toolbar === 'floating') {
            const show = !editorState.getSelection().isCollapsed() && !this.state.readOnly;
            toolbar = <FloatingToolbar editor={this} show={show} plugins={this.plugins}/>;
        }

        this.plugins.setPreview(this.props.preview);

        return (
            <div className="rich-editor rich-editor__root" onMouseDown={this.focus}>
                {toolbar}
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
                        onTab={this.plugins.getOnTabFn()}
                        //
                        ref="editor"
                        readOnly={this.state.readOnly}
                        editorState={editorState}
                        onChange={this.onChange}
                        placeholder={this.props.placeholder}
                        spellCheck={true}/>
                    <CustomViews preview={this.props.preview} plugins={this.plugins}/>
                </div>
            </div>
        );
    }
};

export default Editor;