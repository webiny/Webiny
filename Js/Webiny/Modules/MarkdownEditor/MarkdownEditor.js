import Webiny from 'Webiny';

class MarkdownEditor extends Webiny.Ui.FormComponent {
    constructor(props) {
        super(props);

        this.mdEditor = null;
        this.options = null;

        this.bindMethods('getTextareaElement', 'setValue', 'getEditor');
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
            this.props.onChange(this.mdEditor.codemirror.getValue());
        });
    }

    componentWillReceiveProps(props) {
        if (this.mdEditor.codemirror.getValue() !== props.value && !_.isNull(props.value)) {
            // the "+ ''" sort a strange with splitLines method within CodeMirror
            this.mdEditor.codemirror.setValue(props.value + '');
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    setValue(value) {
        this.mdEditor.codemirror.setValue(value);
    }

    getEditor() {
        return this.mdEditor;
    }

    getTextareaElement() {
        return ReactDOM.findDOMNode(this).querySelector('textarea');
    }
}

MarkdownEditor.defaultProps = {

    renderer() {
        return (
            <div className="smde">
                <textarea></textarea>
            </div>
        );
    }
};

export default MarkdownEditor;
