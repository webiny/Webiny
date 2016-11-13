import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import AtomicPlugin from './../BasePlugins/AtomicPlugin';
import Utils from './../Utils';

// TODO: move this to TheHub

class ReactSandboxEditComponent extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.bindMethods('updateEntityData,parseCode,toggleCode');

        this.state = {
            value: _.get(props, 'entity.data.code', ''),
            hideCode: _.get(props, 'entity.data.hideCode', false)
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
    }

    updateEntityData(data) {
        Draft.Entity.mergeData(this.props.entity.key, data);
    }

    toggleCode(flag) {
        this.setState({hideCode: flag}, () => {
            this.updateEntityData({hideCode: flag});
        });
    }
}

ReactSandboxEditComponent.defaultProps = {
    renderer() {
        if (this.props.editor.getPreview() && this.state.hideCode) {
            return (
                <Ui.Grid.Row>
                    <Ui.Grid.Col all={6}>
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
            <Ui.Grid.Row>
                <Ui.Grid.Col all={8} className="code-block">
                    <Ui.CodeEditor {...editorProps}/>
                </Ui.Grid.Col>
                <Ui.Grid.Col all={4}>
                    <div className="component-plugin-wrapper">
                        <div className="component-plugin-wrapper__toolbar">
                            <Ui.Button icon="fa-play" onClick={this.parseCode} align="left"/>
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