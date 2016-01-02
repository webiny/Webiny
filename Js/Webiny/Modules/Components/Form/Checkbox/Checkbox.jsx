import InputComponent from './../Base/InputComponent';

class Checkbox extends InputComponent {

	constructor() {
		super();
		this.bindMethods('onChange', 'childChanged');
	}

	componentWillMount() {
		super.componentWillMount();
		this.id = Webiny.Tools.createUID();
	}

	/**
	 * This method is used as an onChange callback for child CheckboxGroup elements
	 *
	 * @param key Key in parent state to update
	 * @param newValue
	 */
	childChanged(key, newValue) {
		if (this.props.valueLink) {
			this.props.valueLink.requestChange(newValue);
		} else {
			this.props.onChange(key, newValue);
		}
	}

	render() {
		let id = this.id;
		let value = _.get(this.props, 'valueLink.value') || this.props.state;

		let disabled = this.props.disabled ? 'checkbox-disabled' : false;
		let css = this.classSet('checkbox-custom checkbox-default mt10', disabled, this.props.className);
		let children = null;

		if (this.props.children) {
			children = React.Children.map(this.props.children, (child, key) => {
				let newProps = {
					key: key,
					form: this.props.form || null,
					onChange: this.childChanged,
					stateKey: this.props.stateKey,
					state: this.props.state,
					disabled: this.props.disabled
				};
				return React.cloneElement(child, newProps, child.props.children);
			});
		}

		// TODO: remove inline style when CSS fix arrives
		children = <label htmlFor={id} style={{paddingTop: 0}}>{this.props.label} {children}</label>;

		let checkboxProps = {
			disabled: this.props.disabled,
			type: 'checkbox',
			onChange: this.onChange,
			checked: !_.isNull(value) && value !== false && value !== undefined,
			id: id
		};

		return (
			<div className={css}>
				<input {...checkboxProps}/>
				{children}
				{this.props.addon || null}
			</div>
		);
	}

	onChange(e) {
		if (this.props.valueLink) {
			this.props.valueLink.requestChange(e.target.checked);
		} else {
			this.props.onChange(this.props.stateKey, e.target.checked);
		}
	}
}

Checkbox.defaultProps = {
	disabled: false,
	label: '',
	grid: 3,
	className: ''
};

export default Checkbox;