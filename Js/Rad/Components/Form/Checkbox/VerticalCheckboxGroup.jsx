import BaseCheckboxGroup from './BaseCheckboxGroup';
import Checkbox from './Checkbox';

class VerticalCheckboxGroup extends BaseCheckboxGroup {

	render() {
		var {validationError, validationIcon, validationClass} = this.getValidationValues();
		var css = this.classSet('form-group', validationClass);

		var label = null;
		if (this.props.label != '') {
			label = <label className="control-label">{this.props.label}</label>;
		}

		var items = this.getOptions();
        var classes = this.classSet(this.componentWrapperClass, {disabled: this.props.disabled});

		return (
			<div className={classes}>
				<div className={css}>{label}
					<div className="clearfix"></div>
					{items}
					{validationIcon}
					{validationError}
				</div>
			</div>
		);
	}
}

export default VerticalCheckboxGroup;