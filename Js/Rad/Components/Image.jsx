import Component from './../Lib/Component';

class Image extends Component {

	render() {
		return <img {...this.props} src={_.isObject(this.props.src) ? this.props.src.src : this.props.src}/>;
	}
}

export default Image;