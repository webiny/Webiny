import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import demo from './demo';

class EditorView extends Webiny.Ui.View {
    constructor(props) {
        super(props);

        this.plugins = [
            new Webiny.Draft.Plugins.Bold(),
            new Webiny.Draft.Plugins.Italic(),
            new Webiny.Draft.Plugins.Underline(),
            new Webiny.Draft.Plugins.Link(),
            new Webiny.Draft.Plugins.Blockquote(),
            new Webiny.Draft.Plugins.CodeBlock(),
            new Webiny.Draft.Plugins.ReactSandbox(),
            new Webiny.Draft.Plugins.ToJSON()
        ];

        this.state = {
            preview: false,
            value: demo
        };
    }

    onChange(value) {
        this.setState({value});
    }
}

EditorView.defaultProps = {
    renderer() {
        return (
            <Ui.Grid.Row style={{marginTop: 20}}>
                <Ui.Grid.Col xs={10} xsOffset={1}>
                    <Ui.Button label={this.state.preview ? 'Edit' : 'Preview'}
                               onClick={() => this.setState({preview: !this.state.preview})}/>
                    <hr/>
                    <Ui.Draft.Editor value={this.state.value} onChange={this.onChange.bind(this)} placeholder="Tell a story..."
                            plugins={this.plugins} preview={this.state.preview}/>
                </Ui.Grid.Col>
            </Ui.Grid.Row>
        );
    }
};

export default EditorView;