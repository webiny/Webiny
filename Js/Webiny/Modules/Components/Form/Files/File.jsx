import FormComponent from './../Base/FormComponent';
import VerticalFile from './File/VerticalFile';

class File extends FormComponent {
	
	render() {
		var formType = super.getFormType();

		if (formType == 'vertical') {
			return React.createElement(VerticalFile, this.props, this.props.children);
		}

		if (formType == 'horizontal') {
			return null;
		}

		// Native input field
		return React.createElement('input', _.assign({}, this.props, {className: 'form-control', type: 'file'}));
	}
}

File.defaultProps = {
	disabled: false,
	placeholder: '',
	name: null
};

export default File;
