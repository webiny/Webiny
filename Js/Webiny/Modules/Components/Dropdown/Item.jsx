import Component from './../../../Lib/Core/Component';

class Item extends Component {

	onClick() {
		this.props.parent.setState({title: this.props.label});
		this.props.onClick ? this.props.onClick(this.props) : this.props.parent.props.onClick(this.props);
	}

	render() {
		var classes = this.classSet(this.props.className);

		return (
			<li className={classes} onClick={this.onClick.bind(this)}>
				<a href="javascript:void(0)">{this.props.label}</a>
			</li>
		);
	}
}
export default Item;