import FormComponent from './../Base/FormComponent';
import HorizontalPassword from './HorizontalPassword';
import VerticalPassword from './VerticalPassword';

class Input extends FormComponent {
	
	componentWillMount() {
		this.inputRef = Webiny.Tools.createUID();
	}

	render() {
		var formType = super.getFormType();

		var props = _.clone(this.props);
		props['ref'] = this.inputRef;

		if (formType == 'vertical') {
			return React.createElement(VerticalPassword, props, this.props.children);
		}

		if (formType == 'horizontal') {
			return React.createElement(HorizontalPassword, props, this.props.children);
		}

		// Native input field
		return React.createElement('input', _.assign({}, props, {className: 'form-control'}));
	}
}

Input.defaultProps = {
	disabled: false,
    readOnly:false,
	placeholder: '',
	grid: 12,
	name: null,
	type: 'text'
};

export default Input;
