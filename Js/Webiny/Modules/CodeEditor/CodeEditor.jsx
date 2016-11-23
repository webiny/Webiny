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