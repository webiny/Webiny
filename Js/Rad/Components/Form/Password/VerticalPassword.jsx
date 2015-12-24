import InputComponent from './../Base/InputComponent';
import Checkbox from './../Checkbox/Checkbox';

class VerticalPassword extends InputComponent {

    render() {
        var {validationError, validationIcon, validationClass} = this.getValidationValues();

        var css = this.classSet('form-group input-password', validationClass);
        var label = null;
        if (this.props.label) {
            label = <label className="control-label">{this.props.label}</label>;
        }

		let props = {
			onBlur: this.validate,
			disabled: this.props.disabled,
			readOnly: this.props.readOnly,
			type: this.state.passwordVisible ? 'text' : 'password',
			className: 'form-control',
			valueLink: this.props.valueLink,
			placeholder: this.props.placeholder,
			ref: 'input'
		};

		let input = <input {...props}/>;

        let checkbox = null;
        if (this.props.showPasswordToggle) {
            let checkboxProps = {
                label: 'Show',
                onChange: this.togglePasswordVisibility,
                valueLink: this.linkState('passwordVisible')
            };
            checkbox = <Checkbox {...checkboxProps}/>;
        }

        return (
            <div className={this.getComponentWrapperClass()}>
                <div className={css}>
                    {label}
                    {input}
                    {checkbox}
                    {validationError}
                    {validationIcon}
                </div>
            </div>
        );
    }
}

VerticalPassword.defaultProps = {
    showPasswordToggle: true
};

export default VerticalPassword;