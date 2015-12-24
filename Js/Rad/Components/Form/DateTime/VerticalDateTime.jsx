import Base from './Base';

class VerticalDateTime extends Base {

	render() {
		let {validationError, validationIcon, validationClass} = this.getValidationValues();

		let css = this.classSet('form-group', validationClass);
		let label = null;
		if (this.props.label) {
			label = <label className="control-label">{this.props.label}</label>;
		}

		let props = {
			onBlur: this.validate,
			disabled: this.props.disabled,
			readOnly: this.props.readOnly,
			type: this.props.type,
			className: 'form-control',
			valueLink: this.valueLink,
			placeholder: this.props.placeholder,
			ref: 'input'
		};

		let input = <input {...props}/>;

		return (
			<div className={this.getComponentWrapperClass()}>
				<div className={css}>
					{label}
					{input}
					{validationError}
					{validationIcon}
				</div>
			</div>
		);
	}
}

export default VerticalDateTime;