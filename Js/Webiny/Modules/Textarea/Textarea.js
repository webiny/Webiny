import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Textarea extends Webiny.Ui.FormComponent {

}

Textarea.defaultProps = _.merge({}, Webiny.Ui.FormComponent.defaultProps, {
    delay: 400,
    renderer() {
        const cssConfig = {
            'form-group': true,
            'error': this.state.isValid === false,
            'success': this.state.isValid === true
        };

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
                {this.renderLabel()}
                <Webiny.Ui.Components.DelayedOnChange delay={this.props.delay}>
                    <textarea {...props}/>
                </Webiny.Ui.Components.DelayedOnChange>
                {this.renderDescription()}
                {this.renderValidationMessage()}
            </div>
        );
    }
});

export default Textarea;