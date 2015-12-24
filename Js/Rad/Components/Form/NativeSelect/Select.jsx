import FormComponent from './../Base/FormComponent';
import HorizontalSelect from './HorizontalSelect';
import VerticalSelect from './VerticalSelect';

class Select extends FormComponent {
	
	render() {
		var formType = super.getFormType();
		
		var props = _.clone(this.props);

		if(props.options){
			var options = [];
			_.forIn(props.options, (label, value) => {
				options.push(<option value={value}>{label}</option>);
			});
			props.children = options;
		}

		if (formType == 'vertical') {
			return React.createElement(VerticalSelect, props, this.props.children);
		}

		if (formType == 'horizontal') {
			return React.createElement(HorizontalSelect, props, this.props.children);
		}

		return null;
	}
}

Select.defaultProps = {
	disabled: false,
	grid: 12,
	name: null
};

export default Select;
