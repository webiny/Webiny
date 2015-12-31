import FormComponent from './../Base/FormComponent';
import VerticalSearch from './VerticalSearch';
import HorizontalSearch from './HorizontalSearch';

class Search extends FormComponent {

	componentWillMount() {
		this.inputRef = Webiny.Tools.createUID();
	}

	render() {
		var formType = super.getFormType();

		var props = _.clone(this.props);
		props['ref'] = this.inputRef;

		if (formType == 'vertical') {
			return React.createElement(VerticalSearch, props, this.props.children);
		}

		if (formType == 'horizontal') {
			return React.createElement(HorizontalSearch, props, this.props.children);
		}

		return null;
	}
}

Search.defaultProps = {
	disabled: false,
	placeholder: '',
	grid: 12,
	name: null
};

export default Search;
