import Webiny from 'Webiny';

class CodeEditor extends Webiny.Ui.FormComponent {
    focus() {
        this.refs.editor.focus();
    }
}

CodeEditor.defaultProps = _.merge({}, Webiny.Ui.FormComponent.defaultProps, {
    mode: 'text/html',
    theme: 'monokai',
    readOnly: false, // set 'nocursor' to disable cursor
    onFocus: _.noop,
    renderer() {
        const cssConfig = {
            'form-group': true,
            'error': this.state.isValid === false,
            'success': this.state.isValid === true
        };

        const props = _.pick(this.props, ['value', 'onChange', 'onFocus', 'theme', 'mode', 'readOnly']);
        _.assign(props, {
            ref: 'editor',
            onBlur: this.validate,
            className: 'form-control',
            placeholder: this.getPlaceholder()
        });

        const {SimpleCodeEditor, DelayedOnChange} = this.props;

        return (
            <div className={this.classSet(cssConfig)}>
                {this.renderLabel()}
                <DelayedOnChange>
                    <SimpleCodeEditor {...props}/>
                </DelayedOnChange>
                {this.renderDescription()}
                {this.renderValidationMessage()}
            </div>
        );
    }
});

export default Webiny.createComponent(CodeEditor, {modules: ['SimpleCodeEditor', 'DelayedOnChange']});