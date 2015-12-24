import BaseRadioGroup from './BaseRadioGroup';

class VerticalRadioGroup extends BaseRadioGroup {

	render() {
		var items = this.getOptions();

		var classes = this.classSet(this.getComponentWrapperClass(), {disabled: this.props.disabled});

        return (
			<div className={classes}>
				<div className="form-group">
					<label className="control-label">{this.props.label}</label>

					<div className="clearfix"></div>
					{items}
				</div>
			</div>
		);
	}
}

export default VerticalRadioGroup;