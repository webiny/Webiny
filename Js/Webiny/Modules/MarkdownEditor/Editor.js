import Webiny from 'Webiny';

class Editor extends Webiny.Ui.FormComponent {
    constructor(props) {
        super(props);

        this.mdEditor = null;
        this.options = null;

        this.bindMethods('getTextareaElement', 'setValue');
    }

    componentDidMount() {
        super.componentDidMount();

        const mdConfig = {
            element: this.getTextareaElement(),
            renderingConfig: {
                codeSyntaxHighlighting: true
            },
            hideIcons: ['side-by-side', 'fullscreen'],
            indentWithTabs: true,
            tabSize: 4
        };

        this.mdEditor = new SimpleMDE(mdConfig);

        this.mdEditor.codemirror.on('change', () => {
            this.props.valueLink.requestChange(this.mdEditor.codemirror.getValue());
        });
    }

    setValue(value) {
        this.mdEditor.codemirror.setValue(value);
    }

    componentWillReceiveProps(props) {
        if (this.mdEditor.codemirror.getValue() !== props.valueLink.value && !_.isNull(props.valueLink.value)) {
            // the "+ ''" sort a strange with splitLines method within CodeMirror
            this.mdEditor.codemirror.setValue(props.valueLink.value + '');
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    getTextareaElement() {
        return $(ReactDOM.findDOMNode(this)).find('textarea')[0];
    }
}

Editor.defaultProps = {

    renderer() {
        return (
            <div className="smde">
                <textarea></textarea>
            </div>
        );
    }
};

export default Editor;
