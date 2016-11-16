import Webiny from 'Webiny';

class CodeEditor extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.codeMirror = null;
        this.options = {
            lineNumbers: true,
            htmlMode: true,
            mode: props.mode, // needs to be loaded via bower.json
            theme: props.theme // needs to be loaded via bower.json
        };

        this.bindMethods('getTextareaElement', 'setValue');
    }

    componentDidMount() {
        super.componentDidMount();

        this.options = _.merge(this.options, this.props);

        this.codeMirror = CodeMirror.fromTextArea(this.getTextareaElement(), this.options);

        this.codeMirror.on('change', () => {
            this.props.onChange(this.codeMirror.getValue());
        });

        this.codeMirror.on('focus', () => {
            this.props.onFocus();
        });

        this.setValue(this.props);
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.setValue(props);

        if (this.props.mode !== props.mode) {
            this.codeMirror.setOption('mode', props.mode);
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    setValue(props) {
        if (this.codeMirror.getValue() !== props.value && !_.isNull(props.value)) {
            // the "+ ''" sort a strange with splitLines method within CodeMirror
            this.codeMirror.setValue(props.value + '');
        }
    }

    getTextareaElement() {
        return $(ReactDOM.findDOMNode(this)).find('textarea')[0];
    }

    focus() {
        this.codeMirror.focus();
    }
}

CodeEditor.defaultProps = {
    mode: 'text/html',
    theme: 'monokai',
    value: null,
    onChange: _.noop,
    onFocus: _.noop,
    renderer() {
        return (
            <div>
                <textarea></textarea>
            </div>
        );
    }
};

export default CodeEditor;