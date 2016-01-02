import Component from './../../../Core/Core/Component';

class Select2Component extends Component {

	constructor() {
		super();
		this.select2 = null;
		this.options = null;
	}

	getValue() {
		var value = this.props.valueLink ? this.props.valueLink.value : this.props.selectedValue;
		if (!value) {
			return value;
		}

		return _.isObject(value) ? value.id : '' + value;
	}

	triggerChange(value) {
		if (this.props.valueLink) {
			this.props.valueLink.requestChange(value);
		}
		this.props.changed(value);
	}

	componentDidMount() {
		this.select2 = $(ReactDOM.findDOMNode(this)).select2(this.getConfig(this.props));
		this.select2.on("select2:select", e => {
			this.triggerChange(e.target.value);
		});
		this.select2.on("select2:unselect", e => {
			this.triggerChange('');
		});
		this.select2.val(this.getValue()).trigger('change');
	}

	componentWillReceiveProps(props) {
		if (!this.options || !_.isEqual(props.options, this.options)) {
			this.select2.html('');
			$(ReactDOM.findDOMNode(this)).select2(this.getConfig(props));
		}
	}

	componentDidUpdate() {
		let possibleValues = _.pluck(this.options, 'id');
		let value = this.getValue();
		let inPossibleValues = possibleValues.indexOf(value) > -1;

		if (value != null && !inPossibleValues && possibleValues.length > 0) {
			this.triggerChange(null);
			return;
		}

		if (value != null && inPossibleValues) {
			return this.select2.val(value).trigger('change');
		}

		this.select2.val('').trigger('change');
	}

	getConfig(props) {
		let renderer = function (item) {
			if (item.text.indexOf('<') === 0) {
				return $(item.text);
			}
			return item.text;
		};

		let config = {
			disabled: props.disabled,
			minimumResultsForSearch: props.minimumResultsForSearch,
			placeholder: props.placeholder,
			allowClear: props.allowClear,
			templateResult: renderer,
			templateSelection: renderer
		};

		if (!this.options || !_.isEqual(props.options, this.options)) {
			this.options = props.options;
			config['data'] = props.options;
		}

		return config;
	}

	render() {
		return <select/>;
	}
}

Select2Component.defaultProps = {
	allowClear: false,
	placeholder: null,
	changed: _.noop,
	selectedValue: '',
	minimumResultsForSearch: 15
};

export default Select2Component;