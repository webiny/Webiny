import Component from './../Lib/Component';

class Progress extends Component {

	render() {
		var props = {
			role: 'progressbar',
			'aria-valuenow': this.props.progress,
			'aria-valuemin': 0,
			'aria-valuemax': 100,
			style: {
				width: this.props.progress + '%'
			}
		};

		return (
			<div className="progress" style={this.props.style}>
				<div className="progress-bar progress-bar-primary" {...props}>
					{this.props.progress}%
				</div>
			</div>
		);
	}
}

Progress.defaultProps = {
	progress: 0,
	style: {}
};

export default Progress;