import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import AtomicPlugin from './../BasePlugins/AtomicPlugin';
import SyntaxHighlight from './../Plugins/SyntaxHighlight';
import Editor from './../Editor';
import Utils from './../Utils';

class CodeBlockComponent extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.bindMethods('switchLanguage');

        const entityKey = props.block.getEntityAt(0);
        let entityData = {};
        if (entityKey) {
            entityData = Draft.Entity.get(entityKey).get('data');
        }

        this.plugins = [
            new SyntaxHighlight({blockType: 'any', language: entityData.language || 'jsx'})
        ];

        let editorState = null;
        const code = entityData.code;

        if (_.isPlainObject(code)) {
            editorState = code;
        }

        this.state = {
            editorState,
            language: entityData.language || 'jsx'
        };
    }

    switchLanguage(language) {
        this.setState({language}, () => {
            this.plugins[0].setConfig({language});
            this.updateEntityData({language});
            this.refs.editor.forceRerender();
        });
    }

    updateEntityData(data) {
        const block = this.props.block;
        const entityKey = block.getEntityAt(0);
        if (entityKey) {
            Draft.Entity.mergeData(entityKey, data);
        }
    }
}

CodeBlockComponent.defaultProps = {
    renderer() {
        const editorProps = {
            ref: 'editor',
            stripPastedStyles: true,
            readOnly: !this.props.editor.getReadOnly(),
            value: this.state.editorState,
            onChange: editorState => {
                this.setState({editorState}, () => {
                    this.updateEntityData({code: Draft.convertToRaw(editorState.getCurrentContent())});
                });
            },
            plugins: this.plugins
        };
        return (
            <Ui.Grid.Row>
                <Ui.Grid.Col all={12} className="code-block">
                    <div style={{position: 'absolute', right: 20, top: 5}}>
                        <Ui.Dropdown title={this.state.language} className="balloon">
                            <Ui.Dropdown.Header title="Language"/>
                            <Ui.Dropdown.Link title="HTML" onClick={() => this.switchLanguage('html')}/>
                            <Ui.Dropdown.Link title="JSON" onClick={() => this.switchLanguage('json')}/>
                            <Ui.Dropdown.Link title="JSX" onClick={() => this.switchLanguage('jsx')}/>
                            <Ui.Dropdown.Link title="JAVASCRIPT" onClick={() => this.switchLanguage('javascript')}/>
                            <Ui.Dropdown.Link title="PHP" onClick={() => this.switchLanguage('php')}/>
                            <Ui.Dropdown.Link title="YAML" onClick={() => this.switchLanguage('yaml')}/>
                        </Ui.Dropdown>
                    </div>
                    <div className={'language-' + this.state.language}>
                        <Editor {...editorProps}/>
                    </div>
                </Ui.Grid.Col>
            </Ui.Grid.Row>
        );
    }
};

class CodeBlockPlugin extends AtomicPlugin {
    constructor(config) {
        super(config);
        this.name = 'code-block';
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
            toolbar: <Ui.Draft.Toolbar.Atomic icon="fa-code" plugin={this}/>,
            blockRendererFn: (contentBlock) => {
                const plugin = contentBlock.getData().get('plugin');
                if (contentBlock.getType() === 'atomic' && plugin === this.name) {
                    return {
                        component: CodeBlockComponent,
                        editable: false
                    };
                }
            }
        };
    }
}

export default CodeBlockPlugin;