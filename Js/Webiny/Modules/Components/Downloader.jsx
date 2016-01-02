import Component from './../Core/Core/Component';

class Downloader extends Component {

	constructor() {
		super();
	}

	componentDidUpdate() {
		if (this.refs.downloader) {
			ReactDOM.findDOMNode(this.refs.downloader).submit();
			this.props.onSubmit();
		}
	}

	render() {
		var action = this.props.action;

		if (!action) {
			return null;
		}

		if (this.props.filters && !this.props.ids) {
			action += '?' + jQuery.param(this.props.filters);
		}

		var ids = null;
		if (this.props.ids) {
			ids = this.props.ids.map((id, index) => {
				return <input type="hidden" name="ids[]" value={id} key={index}/>;
			});
		}

		var authorization = null;
		if (this.props.method != 'GET') {
			authorization = <input type="hidden" name="Authorization" value={window.localStorage.adminToken}/>;
		}

		return (
			<form ref="downloader" action={action} method={this.props.method} target="_blank">
				{ids}
				{authorization}
			</form>
		);
	}
}

Downloader.defaultProps = {
	method: 'POST',
	action: null,
	onSubmit: _.noop
};

export default Downloader;