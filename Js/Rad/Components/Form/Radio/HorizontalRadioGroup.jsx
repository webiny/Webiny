import BaseRadioGroup from './BaseRadioGroup';

class HorizontalRadioGroup extends BaseRadioGroup {

	render() {
		var items = this.getOptions();

        var classes = this.classSet(this.getComponentWrapperClass(), {disabled: this.props.disabled});
		return (
			<div className={classes}>
				<div className="form-group">
					<label className="control-label col-xs-4">{this.props.label}</label>

					<div className="col-xs-8">{items}</div>
				</div>
			</div>
		);
	}
}

export default HorizontalRadioGroup;