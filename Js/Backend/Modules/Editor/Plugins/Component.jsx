import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
const {Entity, RichUtils} = Draft;
import DraftUtils from './../DraftUtils';
import Editor from './../WebinyDraftEditor';
import ToJson from './../Plugins/ToJSON';
import ExecuteComponent from './../Plugins/ExecuteComponent';
import SyntaxHighlightPlugin from './../Plugins/SyntaxHighlight';

class Component extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: null,
            code: null
        };

        this.bindMethods('parseCode', 'switchLanguage', 'applyCode');

        this.plugins = [
            SyntaxHighlightPlugin({language: props.data.language || 'jsx'}),
            ExecuteComponent(this.applyCode)
        ];
    }

    componentDidMount() {
        super.componentDidMount();
        if (this.props.data.code) {
            this.setState({value: Draft.EditorState.createWithContent(Draft.convertFromRaw(this.props.data.code))});
        }
    }

    componentDidUpdate(prevProps) {
        super.componentDidUpdate();
        if (prevProps.data.language !== this.props.data.language) {
            this.refs.editor.forceRerender();
        }
    }

    parseCode() {
        const lines = [];
        if (!this.state.value) {
            return;
        }

        this.state.value.getCurrentContent().getBlockMap().map(b => {
            lines.push(b.getText());
        });

        let code = null;
        try {
            code = eval(Babel.transform(lines.join(''), {presets: ['react', 'es2015']}).code);
            this.setState({code, key: _.uniqueId('code-')});
        } catch (e) {
            this.setState({code: null});
        }
    }

    switchLanguage(language) {
        this.props.updateData({language});
    }

    applyCode() {
        this.props.updateData({code: Draft.convertToRaw(this.state.value.getCurrentContent())});
        this.parseCode();
    }
}

Component.defaultProps = {
    renderer() {
        const editorProps = {
            ref: 'editor',
            stripPastedStyles: true,
            readOnly: !this.props.editor.getReadOnly(),
            value: this.state.value,
            onChange: value => {
                this.setState({value});
            },
            editPlugins: this.plugins
        };

        return (
            <Ui.Grid.Row>
                <Ui.Grid.Col all={6} className="component-code-editor">
                    <div style={{position: 'absolute', right: 20, top: 5}}>
                        <Ui.Dropdown title={this.props.data.language || 'jsx'} className="balloon">
                            <Ui.Dropdown.Header title="Language"/>
                            <Ui.Dropdown.Link title="HTML" onClick={() => this.switchLanguage('html')}/>
                            <Ui.Dropdown.Link title="JSX" onClick={() => this.switchLanguage('jsx')}/>
                            <Ui.Dropdown.Link title="PHP" onClick={() => this.switchLanguage('php')}/>
                        </Ui.Dropdown>
                    </div>
                    <Editor {...editorProps}/>
                </Ui.Grid.Col>
                <Ui.Hide if={!React.isValidElement(this.state.code)}>
                    <Ui.Grid.Col all={6}>
                        <div className="component-plugin-wrapper">
                            <Ui.Form key={this.state.key}>
                                {(model) => (
                                    <Ui.Grid.Row>
                                        <Ui.Grid.Col all={6}>
                                            {React.isValidElement(this.state.code) && this.state.code}
                                        </Ui.Grid.Col>
                                        <Ui.Grid.Col all={6}>
                                            Form model:
                                            <pre>{JSON.stringify(model, null, 4)}</pre>
                                        </Ui.Grid.Col>
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

class ComponentAction extends Webiny.Ui.Component {
    getComponent() {
        const editorState = this.props.editor.getEditorState();
        this.props.editor.setEditorState(DraftUtils.insertDataBlock(editorState, {plugin: 'component'}));
    }
}

ComponentAction.defaultProps = {
    renderer(){
        return (
            <Ui.Button disabled={this.props.editor.getReadOnly()} onClick={this.getComponent.bind(this)} icon="fa-puzzle-piece"/>
        );
    }
};

export default () => {
    return {
        name: 'component',
        toolbar: <ComponentAction/>,
        blockRendererFn: (contentBlock) => {
            const type = contentBlock.getType();
            const dataType = contentBlock.getData().toObject().plugin;
            if (type === 'atomic' && dataType === 'component') {
                return {
                    component: Component
                };
            }
        }
    };
}