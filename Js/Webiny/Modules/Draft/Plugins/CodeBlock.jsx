import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import AtomicPlugin from './../BasePlugins/AtomicPlugin';
import Editor from './../Editor';
import Utils from './../Utils';

const languageMap = {
    'html': 'text/html',
    'json': 'application/json',
    'jsx': 'text/jsx',
    'javascript': 'text/javascript',
    'php': 'text/x-php',
    'yaml': 'text/x-yaml'
};

class CodeBlockEditComponent extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.bindMethods('switchLanguage,updateEntityData');

        const entityKey = props.block.getEntityAt(0);
        let entityData = {};
        if (entityKey) {
            entityData = Draft.Entity.get(entityKey).get('data');
        }

        this.state = {
            value: entityData.code || '',
            language: entityData.language || 'jsx'
        };
    }

    switchLanguage(language) {
        this.refs.editor.focus();
        this.setState({language}, () => {
            this.updateEntityData({language});
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

CodeBlockEditComponent.defaultProps = {
    renderer(){
        const editorProps = {
            ref: 'editor',
            mode: languageMap[this.state.language],
            value: this.state.value,
            onChange: value => {
                this.setState({value}, () => {
                    this.updateEntityData({code: value});
                });
            }
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
                    <Ui.CodeEditor {...editorProps}/>
                </Ui.Grid.Col>
            </Ui.Grid.Row>
        );
    }
};

class CodeBlockPreviewComponent extends Webiny.Ui.Component {
}

CodeBlockPreviewComponent.defaultProps = {
    renderer(){
        const entityKey = this.props.block.getEntityAt(0);
        let entityData = {};
        if (entityKey) {
            entityData = Draft.Entity.get(entityKey).get('data');
        }

        const language = entityData.language === 'jsx' ? 'html' : entityData.language;

        return (
            <div className="code-block code-block--preview">
                <Ui.CodeHighlight language={language}>{entityData.code}</Ui.CodeHighlight>
            </div>
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
            toolbar: <Ui.Draft.Toolbar.Atomic icon="fa-code" plugin={this} tooltip="Insert code block"/>,
            blockRendererFn: (contentBlock) => {
                const plugin = contentBlock.getData().get('plugin');
                if (contentBlock.getType() === 'atomic' && plugin === this.name) {
                    return {
                        component: CodeBlockEditComponent,
                        editable: false
                    };
                }
            }
        };
    }

    getPreviewConfig() {
        return {
            blockRendererFn: (contentBlock) => {
                const plugin = contentBlock.getData().get('plugin');
                if (contentBlock.getType() === 'atomic' && plugin === this.name) {
                    return {
                        component: CodeBlockPreviewComponent,
                        editable: false
                    };
                }
            }
        };
    }
}

export default CodeBlockPlugin;