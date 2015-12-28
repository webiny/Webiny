import FormComponent from './../Base/FormComponent';
import HorizontalTextarea from './HorizontalTextarea';
import VerticalTextarea from './VerticalTextarea';

class Textarea extends FormComponent {
	
	componentWillMount() {
		this.textareaRef = Rad.Tools.createUID();
	}

	render() {
		var formType = super.getFormType();

		var props = _.clone(this.props);
		props['ref'] = this.textareaRef;

		if (formType == 'vertical') {
			return React.createElement(VerticalTextarea, props, this.props.children);
		}

		if (formType == 'horizontal') {
			return React.createElement(HorizontalTextarea, props, this.props.children);
		}

		// Native textarea field
		return React.createElement('textarea', _.assign({}, props, {className: 'form-control'}));
	}

	getDOM() {
		return super.getDOM(this.textareaRef);
	}
}

Textarea.defaultProps = {
	disabled: false,
	placeholder: '',
	grid: 12,
	name: null,
	type: 'text'
};

export default Textarea;
