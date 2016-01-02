import Base from './Base';

class HorizontalInput extends Base {

	render() {
		var {validationError, validationIcon, validationClass} = this.getValidationValues();

		var css = this.classSet(['form-group', validationClass]);

		let label = null;
		let wrapperClass = 'col-xs-12';
		if (this.props.label) {
			label = <label className="control-label col-xs-4">{this.props.label}</label>;
			wrapperClass = 'col-xs-8';
		}

		return (
			<div className={this.getComponentWrapperClass()}>
				<div className={css}>
					{label}
					<div className={wrapperClass}>
						<textarea onBlur={this.validate} disabled={this.props.disabled}
								  autoComplete="off"
								  className="form-control"
								  valueLink={this.props.valueLink}
								  placeholder={this.props.placeholder}
								  style={this.props.style}
								  ref="input"
							/>
						{validationError}
						{validationIcon}
					</div>
				</div>
			</div>
		);
	}
}

export default HorizontalInput;
