import BaseAvatar from './BaseAvatar';

class VerticalAvatar extends BaseAvatar {

	render() {
		var label = null;
		if (this.props.label) {
			label = <label className="control-label">{this.props.label}</label>;
		}

		return (
			<div className={this.getComponentWrapperClass()}>
				<div className="form-group">
					{label}
					<div className="clearfix"></div>
					{this.renderAvatar()}
				</div>
			</div>
		);
	}
}

export default VerticalAvatar;