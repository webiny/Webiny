import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Textarea extends Webiny.Ui.FormComponent {

}

Textarea.defaultProps = _.merge({}, Webiny.Ui.FormComponent.defaultProps, {
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
            value: this.props.value || '',
            placeholder: _.get(this.props.placeholder, 'props.children', this.props.placeholder),
            style: this.props.style,
            onChange: this.props.onChange
        };

        return (
            <div className={this.classSet(cssConfig)}>
                {label}
                <Webiny.Ui.Components.DelayedOnChange>
                    <textarea {...props}/>
                </Webiny.Ui.Components.DelayedOnChange>
                <span className="help-block">{this.props.description}</span>
                {validationMessage}
            </div>
        );
    }
});

export default Textarea;