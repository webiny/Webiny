import Base from './Base';

class HorizontalDateTime extends Base {

	render() {
		let {validationError, validationIcon, validationClass} = this.getValidationValues();

		let css = this.classSet(['form-group', validationClass]);

		let label = null;
		let wrapperClass = '';
		if (this.props.label) {
			label = <label className="control-label col-xs-4">{this.props.label}</label>;
			wrapperClass = 'col-xs-8';
		}

        return (
			<div className={this.getComponentWrapperClass()}>
				<div className={css}>
					{label}
					<div className={wrapperClass}>
						<input onBlur={this.validate}
                               readOnly={this.props.readOnly}
                               disabled={this.props.disabled}
							   type={this.props.type}
							   autoComplete="off"
							   className="form-control"
							   valueLink={this.valueLink}
							   placeholder={this.props.placeholder}
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

export default HorizontalDateTime;