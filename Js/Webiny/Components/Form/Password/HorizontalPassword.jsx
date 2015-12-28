import InputComponent from './../Base/InputComponent';
import Checkbox from './../Checkbox/Checkbox';

class HorizontalPassword extends InputComponent {

	render() {
		let {validationError, validationIcon, validationClass} = this.getValidationValues();
		let css = this.classSet('form-group input-password horizontal', validationClass);

		let label = null;
		let wrapperClass = '';
		if (this.props.label) {
			label = <label className="control-label col-xs-4">{this.props.label}</label>;
			wrapperClass = 'col-xs-8';
		}


        let checkbox = null;
        if (this.props.showPasswordToggle) {
            let checkboxProps = {
                label: 'Show',
                onChange: this.togglePasswordVisibility,
                valueLink: this.linkState('passwordVisible')
            };
            checkbox = <Checkbox {...checkboxProps}/>;
        }

		let inputProps = {
			onBlur: this.validate,
			readOnly: this.props.readOnly,
			disabled: this.props.disabled,
			type: this.state.passwordVisible ? 'text' : 'password',
			autoComplete: 'off',
			className: 'form-control',
			valueLink: this.props.valueLink,
			placeholder: this.props.placeholder,
			ref: 'input'
		};

		let input = <input {...inputProps}/>;


		return (
			<div className={this.getComponentWrapperClass()}>
				{this.props.renderer(this, {label, input, validationError, validationIcon, css, wrapperClass, checkbox})}
			</div>
		);
	}
}

HorizontalPassword.defaultProps = {
    showPasswordToggle: true,
	renderer: (_this, opts) => {
		return (
			<div className={opts.css}>
				{opts.label}
				<div className={opts.wrapperClass}>
					{opts.input}
					{opts.checkbox}
					{opts.validationError}
					{opts.validationIcon}
				</div>
			</div>
		);
	}
};

export default HorizontalPassword;