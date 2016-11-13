import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import AtomicPlugin from './../BasePlugins/AtomicPlugin';
import Utils from './../Utils';

// TODO: move this to TheHub

class ReactSandboxEditComponent extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.bindMethods('updateEntityData,parseCode,toggleCode,toggleHideEditor,toggleHidePreview');

        this.state = {
            value: _.get(props, 'entity.data.code', ''),
            hideCode: _.get(props, 'entity.data.hideCode', false),
            hidePreview: _.get(props, 'entity.data.hideCode', false)
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.parseCode();
    }

    parseCode() {
        if (!this.state.value) {
            return;
        }

        let code = null;
        try {
            /* eslint-disable */
            code = eval(Babel.transform(this.state.value, {presets: ['react', 'es2015']}).code);
            /* eslint-enable */
            this.setState({code, key: _.uniqueId('code-')});
        } catch (e) {
            console.log(e.message);
            this.setState({code: null});
        }

        // set the editor dimensions
        const sandbox = $(ReactDOM.findDOMNode(this))[0];
        $(sandbox).css({
            'height':sandbox.offsetHeight+'px',
            'width':sandbox.offsetWidth+'px'
        });
        const previewArea = $(sandbox).find('.editor-sandbox__editor-area__preview-block')[0];
        $(previewArea).css({'height':(sandbox.offsetHeight-60)+'px'});
        const editorArea = $(sandbox).find('.editor-sandbox__editor-area__code-block')[0];
        $(editorArea).css({'height':(sandbox.offsetHeight-60)+'px'});
    }

    updateEntityData(data) {
        Draft.Entity.mergeData(this.props.entity.key, data);
    }

    toggleCode(flag) {
        this.setState({hideCode: flag}, () => {
            this.updateEntityData({hideCode: flag});
        });
    }

    toggleHideEditor() {
        this.setState({hideEditor: !this.state.hideEditor});
    }

    toggleHidePreview() {
        this.setState({hidePreview: !this.state.hidePreview});
    }
}

ReactSandboxEditComponent.defaultProps = {
    renderer() {
        if (this.props.editor.getPreview() && this.state.hideCode) {
            return (
                <Ui.Grid.Row>
                    <Ui.Grid.Col md={6}>
                        <div className="component-plugin-wrapper">
                            <div className="component-plugin-wrapper__code">
                                {React.isValidElement(this.state.code) && this.state.code}
                            </div>
                        </div>
                    </Ui.Grid.Col>
                </Ui.Grid.Row>
            );
        }
        const editorProps = {
            ref: 'editor',
            mode: 'text/jsx',
            value: this.state.value,
            onChange: value => {
                this.setState({value}, () => {
                    this.updateEntityData({code: value});
                });
            }
        };
        return (
            <div className="editor-sandbox">
                <Ui.Grid.Row className="editor-sandbox__toolbar">
                    <Ui.Grid.Col md={10}>
                        <Ui.Button onClick={this.toggleHideEditor} className={(!this.state.hideEditor && "paneActive")}>Code</Ui.Button>
                        <Ui.Button onClick={this.toggleHidePreview} className={!this.state.hidePreview && "paneActive"}>Preview</Ui.Button>
                    </Ui.Grid.Col>
                    <Ui.Grid.Col md={2} className="text-right">
                        <Ui.Button icon="fa-play" className="run-code" onClick={this.parseCode}>Run Code</Ui.Button>
                    </Ui.Grid.Col>
                </Ui.Grid.Row>

                <Ui.Grid.Row className="editor-sandbox__editor-area">
                    <Ui.Grid.Col md={(this.state.hidePreview ? 12 : 6)} className={"editor-sandbox__editor-area__code-block code-block "+(this.state.hideEditor && "hide")}>
                        <Ui.CodeEditor {...editorProps}/>
                    </Ui.Grid.Col>
                    <Ui.Grid.Col md={(this.state.hideEditor ? 12 : 6)} className={"editor-sandbox__editor-area__preview-block "+(this.state.hidePreview && "hide")}>
                        <div className="component-plugin-wrapper">
                            <div className="component-plugin-wrapper__toolbar">
                                <Ui.Checkbox
                                    renderIf={!this.props.editor.getPreview()}
                                    style={{marginTop: 3}}
                                    label="Hide code"
                                    grid={8}
                                    value={this.state.hideCode}
                                    onChange={this.toggleCode}/>
                            </div>
                            <div className="component-plugin-wrapper__code">
                                {React.isValidElement(this.state.code) && this.state.code}
                            </div>
                        </div>
                    </Ui.Grid.Col>
                </Ui.Grid.Row>
            </div>
        );
    }
};

class ReactSandboxPlugin extends AtomicPlugin {
    constructor(config) {
        super(config);
        this.name = 'react-sandbox';
    }

    createBlock() {
        const insert = {
            type: 'atomic',
            text: ' ',
            data: {
                plugin: this.name
            },
            entity: {
                type: this.name,
                mutability: 'IMMUTABLE'
            }
        };
        const editorState = Utils.insertDataBlock(this.editor.getEditorState(), insert);
        this.editor.setEditorState(editorState);
    }

    getEditConfig() {
        return {
            toolbar: <Ui.Draft.Toolbar.Atomic icon="fa-play" plugin={this} tooltip="React sandbox"/>,
            blockRendererFn: (contentBlock) => {
                const plugin = contentBlock.getData().get('plugin');
                if (contentBlock.getType() === 'atomic' && plugin === this.name) {
                    return {
                        component: ReactSandboxEditComponent,
                        editable: false
                    };
                }
            }
        };
    }

    getPreviewConfig() {
        return this.getEditConfig();
    }
}

export default ReactSandboxPlugin;