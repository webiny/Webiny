import Webiny from 'Webiny';
import Textarea from './Textarea';

class TextareaContainer extends Webiny.Ui.FormComponent {

}

TextareaContainer.defaultProps = {
    renderer() {
        const cssConfig = {
            'form-group': true,
            'error': this.state.isValid === false,
            'success': this.state.isValid === true
        };

        let label = null;
        if (this.props.label) {
            label = <label key="label" className="control-label">{this.props.label}</label>;
        }

        let validationMessage = null;

        if (this.state.isValid === false) {
            validationMessage = <span className="help-block">{this.state.validationMessage}</span>;
        }

        const props = {
            onBlur: this.validate,
            disabled: this.isDisabled(),
            className: 'form-control',
            value: this.props.value || null,
            valueLink: this.props.valueLink,
            placeholder: _.get(this.props.placeholder, 'props.children', this.props.placeholder),
            style: this.props.style,
            onChange: this.props.onChange || null
        };

        return (
            <div className={this.classSet(cssConfig)}>
                {label}
                <Webiny.Ui.Components.DelayedValueLink>
                    <Textarea {...props}/>
                </Webiny.Ui.Components.DelayedValueLink>
                <span className="help-block">{this.props.description}</span>
                {validationMessage}
            </div>
        );
    }
};

export default TextareaContainer;