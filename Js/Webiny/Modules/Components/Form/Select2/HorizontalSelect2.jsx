import InputComponent from './../Base/InputComponent';
import Select2Component from './Select2Component';

class HorizontalSelect extends InputComponent {

	render() {

		var {validationError, validationIcon, validationClass} = this.getValidationValues();

		var label = null;

        if (this.props.label) {
            label = <label className="control-label col-xs-4">{this.props.label}</label>;
		}

        var css = this.classSet('form-group', validationClass);

		return (
			<div className={this.getComponentWrapperClass()}>
				<div className={css}>
					{label}
					<div className="col-xs-8">
						<span>
							<Select2Component {...this.props} changed={this.validate}/>
						</span>
						{validationError}
						{validationIcon}
					</div>
				</div>
			</div>
		);
	}
}

export default HorizontalSelect;