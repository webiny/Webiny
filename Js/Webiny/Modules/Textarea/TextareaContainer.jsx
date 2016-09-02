import Webiny from 'Webiny';
import Textarea from './Textarea';
const Ui = Webiny.Ui.Components;

class TextareaContainer extends Webiny.Ui.FormComponent {

}

TextareaContainer.defaultProps = _.merge({}, Webiny.Ui.FormComponent.defaultProps, {
    renderer() {
        const cssConfig = {
            'form-group': true,
            'error': this.state.isValid === false,
            'success': this.state.isValid === true
        };

        let label = null;
        if (this.props.label) {
            let tooltip = null;
            if (this.props.tooltip) {
                tooltip = <Ui.Tooltip target={<Ui.Icon icon="icon-info-circle"/>}>{this.props.tooltip}</Ui.Tooltip>;
            }
            label = <label key="label" className="control-label">{this.props.label} {tooltip}</label>;
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
            onChange: this.props.onChange || _.noop
        };

        if (!props.valueLink) {
            delete props['valueLink'];
        }

        let textarea = <Textarea {...props}/>;
        if (props.valueLink) {
            textarea = <Webiny.Ui.Components.DelayedValueLink>{textarea}</Webiny.Ui.Components.DelayedValueLink>;
        }

        return (
            <div className={this.classSet(cssConfig)}>
                {label}
                {textarea}
                <span className="help-block">{this.props.description}</span>
                {validationMessage}
            </div>
        );
    }
});

export default TextareaContainer;