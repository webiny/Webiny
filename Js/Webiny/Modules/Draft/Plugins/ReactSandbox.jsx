import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import AtomicPlugin from './../BasePlugins/AtomicPlugin';
import Editor from './../Editor';
import Utils from './../Utils';

class ReactSandboxEditComponent extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.bindMethods('updateEntityData,parseCode');

        const entityKey = props.block.getEntityAt(0);
        let entityData = {};
        if (entityKey) {
            entityData = Draft.Entity.get(entityKey).get('data');
        }

        this.state = {
            value: entityData.code || ''
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
            code = eval(Babel.transform(this.state.value, {presets: ['react', 'es2015']}).code);
            this.setState({code, key: _.uniqueId('code-')});
        } catch (e) {
            this.setState({code: null});
        }
    }

    updateEntityData(data) {
        const block = this.props.block;
        const entityKey = block.getEntityAt(0);
        if (entityKey) {
            Draft.Entity.mergeData(entityKey, data);
        }
    }
}

ReactSandboxEditComponent.defaultProps = {
    renderer(){
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
                        <Ui.Button icon="fa-play" onClick={this.parseCode}/>
                        {React.isValidElement(this.state.code) && this.state.code}
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