import FormComponent from './../Base/FormComponent';
import HorizontalSelect2 from './HorizontalSelect2';
import VerticalSelect2 from './VerticalSelect2';
import Select2Component from './Select2Component';

class Select2 extends FormComponent {

	constructor() {
		super();
		this.options = [];
	}

	componentWillMount() {
		this.prepareOptions(this.props);
	}

	componentWillReceiveProps(props) {
		this.prepareOptions(props);
	}

	prepareOptions(props) {
		this.options = [];
		if (props.children) {
			React.Children.map(props.children, child => {
				this.options.push({
					id: child.props.value,
					text: child.props.children
				});
			});
		}

		if (props.options) {
			_.each(props.options, (value, key) => {
				this.options.push({
					id: key,
					text: value
				});
			});
		}
	}

	render() {
		var formType = super.getFormType();

		var props = _.clone(this.props);
		props.options = this.options;

		if (formType == 'vertical') {
			return React.createElement(VerticalSelect2, props);
		}

        if (formType == 'horizontal') {
			return React.createElement(HorizontalSelect2, props);
		}

		return <Select2Component {...props}/>;
	}
}

Select2.defaultProps = {
	disabled: false,
	grid: 12,
	name: null
};

export default Select2;
