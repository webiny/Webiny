import FormComponent from './../Base/FormComponent';
import HorizontalAvatar from './Avatar/HorizontalAvatar';
import VerticalAvatar from './Avatar/VerticalAvatar';

class Image extends FormComponent {

	render() {
		var formType = super.getFormType();

		if (formType == 'vertical') {
			return React.createElement(VerticalAvatar, this.props, this.props.children);
		}

		if (formType == 'horizontal') {
			return React.createElement(HorizontalAvatar, this.props, this.props.children);
		}

		return null;
	}
}

export default Image;
