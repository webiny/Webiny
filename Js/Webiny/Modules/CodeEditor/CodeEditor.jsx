import Webiny from 'Webiny';
import SimpleCodeEditor from './SimpleCodeEditor';

class CodeEditor extends Webiny.Ui.FormComponent {

}

CodeEditor.defaultProps = _.merge({}, Webiny.Ui.FormComponent.defaultProps, {
    renderer() {
        const cssConfig = {
            'form-group': true,
            'error': this.state.isValid === false,
            'success': this.state.isValid === true
        };

        const props = {
            onBlur: this.validate,
            className: 'form-control',
            value: this.props.value,
            onChange: this.props.onChange,
            placeholder: _.get(this.props.placeholder, 'props.children', this.props.placeholder),
            style: this.props.style,
            mode: this.props.mode,
            readOnly: _.get(this.props, 'readOnly', false)
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