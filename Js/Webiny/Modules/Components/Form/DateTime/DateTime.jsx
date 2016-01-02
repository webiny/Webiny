import FormComponent from './../Base/FormComponent';
import HorizontalDateTime from './HorizontalDateTime';
import VerticalDateTime from './VerticalDateTime';

class DateTime extends FormComponent {
	
	componentWillMount() {
		this.inputRef = Webiny.Tools.createUID();
	}

	render() {
		var formType = super.getFormType();

		var props = _.clone(this.props);
		props['ref'] = this.inputRef;

		if (formType == 'vertical') {
			return React.createElement(VerticalDateTime, props, this.props.children);
		}

		if (formType == 'horizontal') {
			return React.createElement(HorizontalDateTime, props, this.props.children);
		}

		// Native input field
		return React.createElement('input', _.assign({}, props, {className: 'form-control'}));
	}
}

DateTime.defaultProps = {
	disabled: false,
    readOnly:false,
	placeholder: '',
	grid: 12,
	name: null,
	type: 'text',
    inputFormat: 'DD/MMM/YY HH:mm',
    modelFormat: 'YYYY-MM-DD HH:mm:ss',
	minDate: false,
    component: 'datetime'
};

export default DateTime;
