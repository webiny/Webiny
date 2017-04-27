import Webiny from 'Webiny';

class CodeEditor extends Webiny.Ui.FormComponent {
    constructor(props){
        super(props);
        this.bindMethods('focus');
    }

    focus() {
        this.editor.focus();
    }
}

CodeEditor.defaultProps = _.merge({}, Webiny.Ui.FormComponent.defaultProps, {
    mode: 'text/html',
    theme: 'monokai',
    readOnly: false, // set 'nocursor' to disable cursor
    onFocus: _.noop,
    renderer() {
        const props = _.pick(this.props, ['value', 'onChange', 'onFocus', 'theme', 'mode', 'readOnly']);

        _.assign(props, {
            ref: (editor) => this.editor = editor,
            onBlur: this.validate,
            className: 'inputGroup',
            placeholder: this.getPlaceholder()
        });

        const {SimpleCodeEditor, DelayedOnChange, FormGroup} = this.props;

        return (
            <FormGroup valid={this.state.isValid} className={this.props.className}>
                {this.renderLabel()}
                <DelayedOnChange>
                    <SimpleCodeEditor {...props}/>
                </DelayedOnChange>
                {this.renderDescription()}
                {this.renderValidationMessage()}
            </FormGroup>
        );
    }
});

export default Webiny.createComponent(CodeEditor, {modules: ['SimpleCodeEditor', 'DelayedOnChange', 'FormGroup'], api: ['focus']});