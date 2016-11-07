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

        this.bindMethods('switchLanguage');
    }

    switchLanguage(language) {
        this.refs.editor.focus();
        this.props.updateBlockData({language});
    }
}

CodeBlockEditComponent.defaultProps = {
    renderer() {
        const editorProps = {
            ref: 'editor',
            mode: languageMap[this.props.data.language],
            value: this.props.data.code || '',
            onFocus: () => {
                this.props.editor.setReadOnly(true)
            },
            onChange: value => {
                this.props.updateBlockData({code: value});
            }
        };

        return (
            <Ui.Grid.Row>
                <Ui.Grid.Col all={12} className="code-block">
                    <div style={{position: 'absolute', right: 20, top: 5}}>
                        <Ui.Dropdown title={this.props.data.language || 'jsx'} className="balloon">
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
        const language = this.props.data.language === 'jsx' ? 'html' : this.props.data.language;

        return (
            <div className="code-block code-block--preview">
                <Ui.CodeHighlight language={language}>{this.props.data.code}</Ui.CodeHighlight>
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