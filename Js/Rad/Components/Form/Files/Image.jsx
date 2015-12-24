import FormComponent from './../Base/FormComponent';
import PlainImage from './Image/PlainImage';

class Image extends FormComponent {

	render() {
		return React.createElement(PlainImage, this.props, this.props.children);
	}
}

export default Image;
