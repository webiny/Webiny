import BaseComponent from '/Core/Base/BaseComponent';

class Checkbox extends BaseComponent {

	getFqn() {
		return 'Core.View.Checkbox';
	}

	getInitialState() {
		return {
			ref: Tools.createUID()
		};
	}

	getDefaultProperties() {
		return {
			disabled: false,
			label: ''
		}
	}

	getDynamicProperties() {
		return {
			checked: this.props.valueLink.value
		}
	}

	onChange() {
		var el = this.getNode(this.state.ref);
		var checked = $(el).is(':checked');
		this.props.valueLink.requestChange(checked, this.props['bind-change'] || null);
	}
}

export default Checkbox;
