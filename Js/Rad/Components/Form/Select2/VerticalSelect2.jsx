import InputComponent from './../Base/InputComponent';
import Select2Component from './Select2Component';

class VerticalSelect2 extends InputComponent{

	render() {
		var {validationError, validationIcon, validationClass} = this.getValidationValues();

		var css = this.classSet('form-group', validationClass);
		var label = null;
		if (this.props.label) {
			label = <label className="control-label">{this.props.label}</label>;
		}

        return (
			<div className={this.getComponentWrapperClass()} style={{marginBottom: '15px'}}>
				<div className={css}>
					{label}
                    <Select2Component {...this.props} changed={this.validate}/>
                    {validationError}
					{validationIcon}
				</div>
			</div>
		);
	}
}

export default VerticalSelect2;