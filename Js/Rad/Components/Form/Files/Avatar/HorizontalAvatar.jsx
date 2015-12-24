import BaseAvatar from './BaseAvatar';

class HorizontalAvatar extends BaseAvatar {

	render() {
		var label = null;
		if (this.props.label) {
			label = <label className="control-label col-xs-4">{this.props.label}</label>;
		}

		return (
			<div className={this.getComponentWrapperClass()}>
				<div className="form-group">
					{label}
					<div className="col-xs-8">
						{this.renderAvatar()}
					</div>
				</div>
			</div>
		);
	}
}

export default HorizontalAvatar;