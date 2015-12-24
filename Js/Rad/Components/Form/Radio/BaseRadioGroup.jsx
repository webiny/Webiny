import Radio from './Radio';
import InputComponent from './../Base/InputComponent';

class BaseRadioGroup extends InputComponent {

	constructor() {
		super();
		this.state = {
			options: []
		};
		this.bindMethods('registerOptions', 'onChange');
	}

	componentWillMount() {
		super.componentWillMount();
		this.registerOptions(this.props.items, this.props.children);
	}

	/**
	 * Parse <checkbox> tags or use {items} object to build options
	 * @param items
	 * @param children
	 */
	registerOptions(items = null, children = null) {
		var options = [];

		if (items) {
			_.each(items, (label, key) => {
				options.push({label, key});
			});
		} else {
			React.Children.map(children, (child) => {
				var value = child.props.value;

				options.push({
					label: child.props.children,
					key: value,
					grid: child.props.grid || 3
				});
			});
		}

		this.setState({options: options});
	}

	onChange(newValue) {
		if (newValue === "false") {
			newValue = false;
		} else if (newValue === "true") {
			newValue = true;
		}
		this.props.valueLink.requestChange(newValue);
	}

	/**
	 * Create options elements
	 * @returns {Array}
	 */
	getOptions() {
		var items = [];
		_.forEach(this.state.options, (item, key) => {
			var props = {
				key: key,
				grid: item.grid,
				label: item.label,
				stateKey: item.key,
				disabled: this.props.disabled,
				state: this.props.valueLink.value,
				onChange: this.onChange
			};

			items.push(<Radio {...props}/>);
		});
		return items;
	}

	componentWillReceiveProps(nextProps) {
		this.registerOptions(nextProps.items, nextProps.children);
	}
}

BaseRadioGroup.defaultProps = {
	disabled: false,
	label: '',
	grid: 12
};

export default BaseRadioGroup;