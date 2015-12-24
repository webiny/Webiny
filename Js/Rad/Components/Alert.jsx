import Component from './../Lib/Component';

class Alert extends Component {

	wrapItem(item) {
		return (<div key={_.uniqueId('alert-')}>{item}</div>);
	}

	render() {
		if (_.isEmpty(this.props.children)) {
			return null;
		}

		var messages = this.props.children;

		if (_.isArray(messages)) {
			messages = React.Children.map(this.props.children, this.wrapItem);
		}

		let button = null;
		if (this.props.closeButton) {
			button = <button onClick={this.props.onClose} type="button" className="close">×</button>;
		}

		let css = this.classSet('alert alert-' + this.props.type + ' alert-dismissable animated flipInX', this.props.addClassName);

		return (
			<div className={css} style={this.props.style}>
				{button}
				{messages}
			</div>
		);
	}
}

Alert.defaultProps = {
	closeButton: true,
	type: 'primary',
	addClassName: null
};

export default Alert;