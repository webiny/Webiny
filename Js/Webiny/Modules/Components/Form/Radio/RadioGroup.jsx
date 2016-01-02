import FormComponent from './../Base/FormComponent';
import VerticalRadioGroup from './VerticalRadioGroup';
import HorizontalRadioGroup from './HorizontalRadioGroup';

class RadioGroup extends FormComponent {

	componentWillMount(){
		this.radioRef = Webiny.Tools.createUID();
	}

	render(){
		var formType = this.getFormType();
		
		var props = _.clone(this.props);

		props['ref'] = this.radioRef;

		if(formType == 'vertical'){
			return React.createElement(VerticalRadioGroup, props, this.props.children);
		}

		if(formType == 'horizontal'){
			return React.createElement(HorizontalRadioGroup, props, this.props.children);
		}
		
		return null;
	}
}

export default RadioGroup;