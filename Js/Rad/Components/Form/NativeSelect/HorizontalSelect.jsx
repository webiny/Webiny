import InputComponent from './../Base/InputComponent';

class HorizontalSelect extends InputComponent {

	render() {
		var {validationError, validationIcon, validationClass} = this.getValidationValues();

		var css = this.classSet('form-group', validationClass);
		var label = null;
		if (this.props.label) {
			label = <label className="control-label col-xs-4">{this.props.label}</label>;
		}

		var props = {
			onBlur: this.props.validate ? this.validate : null,
			disabled: this.props.disabled,
			className: "form-control",
			valueLink: this.props.valueLink,
			name: this.props.name,
			children: this.props.children
		};

		var select = <div className="col-xs-8"><select {...props}/></div>;
		return (
			<div className={this.getComponentWrapperClass()}>
				<div className={css}>{label} {select} {validationError} {validationIcon}</div>
			</div>
		);

	}
}

export default HorizontalSelect;
