import InputComponent from './../Base/InputComponent';
import Checkbox from './Checkbox';

class BaseCheckboxGroup extends InputComponent {

	constructor() {
		super();
		this.checkboxChildren = [];
		_.assign(this.state, {
			data: {},
			options: []
		});

		this.bindMethods('registerOptions', 'prepareComponent', 'onChange');
	}

	componentWillMount() {
		super.componentWillMount();
		this.prepareComponent(this.props);
	}

	onChange(key, newValue) {
		// This flag tells us whether this was called from nested checkbox group
		var isComplex = _.isArray(newValue) || _.isPlainObject(newValue);

		// If empty array or empty object - convert it to boolean
		if (isComplex && Rad.Tools.keys(newValue).length == 0) {
			newValue = true;
		}

		var partialState = this.state.data;

		if (!newValue) {
			delete partialState[key];
		} else {
			if (_.isBoolean(partialState)) {
				partialState = {};
			}
			partialState[key] = newValue;
		}

		// Set internal checkbox group state
		this.setState({data: partialState});

		// If this group does not have nested groups, we need to convert the model representation to array
		if (!this.checkboxChildren.length) {
			partialState = Object.keys(partialState);
		}

		// Notify main form of a new checkbox group state
		if (this.props.valueLink) {
			this.props.valueLink.requestChange(partialState, this.props.bindChange || null);
		} else {
			this.props.onChange(this.props.stateKey, partialState);
		}

		setTimeout(this.validate);
	}

	/**
	 * Create options elements and handle nested checkbox groups if they exist
	 * @returns {Array}
	 */
	getOptions() {
		var items = [];
		_.forEach(this.state.options, (item, key) => {
			var children = null;
			if (this.checkboxChildren.length) {
				children = this.checkboxChildren;
			}

			var props = {
				form: this.props.form || null,
				key: key,
				stateKey: item.key,
				grid: item.grid,
				label: item.label,
				children: children,
				disabled: this.props.disabled,
				state: this.state.data[item.key],
				onChange: this.onChange,
				addon: this.props.addonRenderer(item.label, item.key)
			};

			items.push(<Checkbox {...props}/>);
		});
		return items;
	}

	/**
	 * Parse <checkbox> tags or use {items} object to build checkboxes
	 * @param items
	 * @param children
	 */
	registerOptions(items = null, children = null) {
		var checkboxes = [];

		if (items) {
			_.each(items, (label, key) => {
				checkboxes.push({
					label: label,
					bind: 'data.' + key,
					key: key
				});
			});
		}

		React.Children.map(children, (child) => {
			if (child.type == 'checkbox' && !items) {
				var key = child.props.value;

				checkboxes.push({
					label: child.props.children,
					bind: 'data.' + key,
					grid: child.props.grid || 3,
					key: key
				});
			}

			if (child.type == 'nested' && !this.checkboxChildren.length) {
				React.Children.map(child.props.children, child => {
					this.checkboxChildren.push(child);
				});
			}
		});

		this.setState({options: checkboxes});
	}

	/**
	 * When we receive new props, we need to convert array into an object for easier checkbox handling
	 * and use that as local state.
	 *
	 * @param nextProps
	 */
	componentWillReceiveProps(nextProps) {
		this.prepareComponent(nextProps);
	}

	/**
	 * Format data for single or nested checkbox groups
	 * @param nextProps
	 */
	prepareComponent(nextProps) {
		var value = _.get(nextProps, 'valueLink.value') || nextProps.state;
		var data = {};
		if (value) {
			if (_.isArray(value)) {
				Rad.Tools.keys(value).forEach(key => {
					data[value[key]] = true;
				});
			} else {
				data = value;
			}
		}
		this.setState({data: data});

		this.registerOptions(nextProps.items, nextProps.children);
	}
}

BaseCheckboxGroup.defaultProps = {
	disabled: false,
	label: '',
	grid: 12,
	addonRenderer: _.noop
};

export default BaseCheckboxGroup;