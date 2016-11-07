import Webiny from 'Webiny';
import SimpleCodeEditor from './SimpleCodeEditor';

class CodeEditor extends Webiny.Ui.FormComponent {
    focus() {
        this.refs.editor.focus();
    }
}

CodeEditor.defaultProps = _.merge({}, Webiny.Ui.FormComponent.defaultProps, {
    mode: 'text/html',
    theme: 'monokai',
    readOnly: false,
    onFocus: _.noop,
    renderer() {
        const cssConfig = {
            'form-group': true,
            'error': this.state.isValid === false,
            'success': this.state.isValid === true
        };

        const props = {
            ref: 'editor',
            onBlur: this.validate,
            className: 'form-control',
            value: this.props.value,
            onChange: this.props.onChange,
            onFocus: this.props.onFocus,
            placeholder: _.get(this.props.placeholder, 'props.children', this.props.placeholder),
            theme: this.props.theme,
            mode: this.props.mode,
            readOnly: this.props.readOnly
        };

        return (
            <div className={this.classSet(cssConfig)}>
                {this.renderLabel()}
                <Webiny.Ui.Components.DelayedOnChange>
                    <SimpleCodeEditor {...props}/>
                </Webiny.Ui.Components.DelayedOnChange>
                {this.renderDescription()}
                {this.renderValidationMessage()}
            </div>
        );
    }
});

export default CodeEditor;