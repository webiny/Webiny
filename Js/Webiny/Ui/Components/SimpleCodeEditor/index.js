import Webiny from 'Webiny';

class SimpleCodeEditor extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.codeMirror = null;
        this.options = {
            lineNumbers: true,
            htmlMode: true,
            mode: props.mode, // needs to be loaded via bower.json
            theme: props.theme, // needs to be loaded via bower.json
            readOnly: props.readOnly
        };

        this.bindMethods('getTextareaElement,setValue,focus');
    }

    componentDidMount() {
        super.componentDidMount();

        this.codeMirror = this.props.CodeMirror.fromTextArea(this.getTextareaElement(), this.options);

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

        const checkProps = ['mode', 'readOnly'];
        _.each(checkProps, (prop) => {
            if (this.props[prop] !== props[prop]) {
                this.codeMirror.setOption(prop, props[prop]);
            }
        });
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
        return ReactDOM.findDOMNode(this).querySelector('textarea');
    }

    focus() {
        this.codeMirror.focus();
    }
}

SimpleCodeEditor.defaultProps = {
    mode: 'text/html',
    theme: 'monokai',
    value: null,
    readOnly: false,
    onChange: _.noop,
    onFocus: _.noop,
    renderer() {
        return (
            <div>
                <textarea/>
            </div>
        );
    }
};

export default Webiny.createComponent(SimpleCodeEditor, {
    modules: [{CodeMirror: () => import('Webiny/Vendors/CodeMirror')}],
    api: ['focus']
});