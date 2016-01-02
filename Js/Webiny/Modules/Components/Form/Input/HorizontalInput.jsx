import InputComponent from './../Base/InputComponent';

class HorizontalInput extends InputComponent {

	render() {
		let {validationError, validationIcon, validationClass} = this.getValidationValues();
		let css = this.classSet('form-group', validationClass);

		let label = null;
		let wrapperClass = '';
		if (this.props.label) {
			label = <label className="control-label col-xs-4">{this.props.label}</label>;
			wrapperClass = 'col-xs-8';
		}

		let props = {
			onBlur: this.validate,
			readOnly: this.props.readOnly,
			disabled: this.props.disabled,
			type: this.props.type,
			autoComplete: 'off',
			className: 'form-control',
			valueLink: this.props.valueLink,
			placeholder: this.props.placeholder,
			onKeyUp: this.props.onKeyUp || _.noop,
			onKeyDown: this.props.onKeyDown || _.noop,
			ref: 'input'
		};

		let input = <input {...props}/>;

		return (
			<div className={this.getComponentWrapperClass()}>
				{this.props.renderer(this, {label, input, validationError, validationIcon, css, wrapperClass})}
			</div>
		);
	}
}

HorizontalInput.defaultProps = {
	renderer: (_this, opts) => {
		return (
			<div className={opts.css}>
				{opts.label}
				<div className={opts.wrapperClass}>
					{opts.input}
					{opts.validationError}
					{opts.validationIcon}
				</div>
			</div>
		);
	}
};

export default HorizontalInput;
