import FormComponent from './../Base/FormComponent';
import HorizontalStaticField from './HorizontalStaticField';
import VerticalStaticField from './VerticalStaticField';

class StaticField extends FormComponent {
	
	componentWillMount() {
		this.inputRef = Webiny.Tools.createUID();
	}

	render() {
		var formType = super.getFormType();

        var props = _.clone(this.props);
		props['ref'] = this.inputRef;

		if (formType == 'vertical') {
			return React.createElement(VerticalStaticField, props, this.props.children);
		}

        if (formType == 'horizontal') {
            return React.createElement(HorizontalStaticField, props, this.props.children);
		}

        return null;
	}
}

StaticField.defaultProps = {
	disabled: false,
	grid: 12
};

export default StaticField;
