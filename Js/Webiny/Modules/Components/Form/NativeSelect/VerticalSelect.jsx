import InputComponent from './../Base/InputComponent';

class VerticalSelect extends InputComponent {

	render() {
		var {validationError, validationIcon, validationClass} = this.getValidationValues();

		var css = this.classSet('form-group', validationClass);
		var label = null;
		if (this.props.label) {
			label = <label className="control-label">{this.props.label}</label>;
		}

		var props = {
			onBlur: this.props.validate ? this.validate : null,
			disabled: this.props.disabled,
			className: "form-control",
			valueLink: this.props.valueLink,
			name: this.props.name,
			children: this.props.children
		};

		var select = <select {...props}/>;
		return (
			<div className={this.getComponentWrapperClass()}>
				<div className={css}>{label} {select} {validationError} {validationIcon}</div>
			</div>
		);
	}
}

export default VerticalSelect;
