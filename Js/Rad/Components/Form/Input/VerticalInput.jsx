import InputComponent from './../Base/InputComponent';

class VerticalInput extends InputComponent {

	onKeyDown(e) {
		switch (e.key) {
			case 'Enter':
				this.props.onEnter(e);
				break;
			default:
				break;
		}
	}

	render() {
		let {validationError, validationIcon, validationClass} = this.getValidationValues();

		let css = this.classSet('form-group', validationClass);

		let label = null;
		if (this.props.label) {
			label = <label key="label" className="control-label">{this.props.label}</label>;
		}

		let props = {
			onBlur: this.validate,
			disabled: this.props.disabled,
			readOnly: this.props.readOnly,
			type: this.props.type,
			className: 'form-control',
			valueLink: this.props.valueLink,
			placeholder: this.props.placeholder,
			onKeyUp: this.props.onKeyUp || null,
			onKeyDown: this.props.onKeyDown || this.onKeyDown.bind(this),
			ref: 'input'
		};

		let input = <input {...props}/>;


		return (
			<div className={this.getComponentWrapperClass()}>
				{this.props.renderer(this, {label, input, validationError, validationIcon, css})}
			</div>
		);
	}
}

VerticalInput.defaultProps = {
	renderer: (_this, opts) => {
		return (
			<div className={opts.css}>
				{opts.label}
				{opts.input}
				{opts.validationError}
				{opts.validationIcon}
			</div>
		);
	},
	onEnter: _.noop
};

export default VerticalInput;