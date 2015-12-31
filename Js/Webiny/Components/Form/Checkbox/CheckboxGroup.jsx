import FormComponent from './../Base/FormComponent';
import VerticalCheckboxGroup from './VerticalCheckboxGroup';
import HorizontalCheckboxGroup from './HorizontalCheckboxGroup';

class CheckboxGroup extends FormComponent {

	componentWillMount(){
		this.checkboxRef = Webiny.Tools.createUID();
	}

	/**
	 * Based on form type, return the correct checkbox group component: VerticalCheckboxGroup, HorizontalCheckboxGroup or plain checkbox
	 * @returns {*}
	 */
	render(){
		var formType = this.getFormType();
		
		var props = _.clone(this.props);
		props['ref'] = this.checkboxRef;

		if(formType == 'vertical'){
			return React.createElement(VerticalCheckboxGroup, props, this.props.children);
		}

		if(formType == 'horizontal'){
			return React.createElement(HorizontalCheckboxGroup, props, this.props.children);
		}
		
		return null;
	}
}

export default CheckboxGroup;