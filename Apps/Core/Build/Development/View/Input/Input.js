import BaseComponent from '/Core/Base/BaseComponent';

class Input extends BaseComponent {

	getTemplate(){ return "React.createElement(\"div\", {className: this.classSet(this.state.css), \"class-obj\": this.state.css},     React.createElement(\"input\", {disabled: this.props.disabled, type: \"text\", className: \"form-control\", valueLink: this.props.valueLink, placeholder: this.props.placeholder}))";}

	getFqn() {
		return 'Core.View.Input';
	}

	getInitialState() {
		var css = 'col-sm-' + this.props.grid;

		var state = {
			css: {}
		};
		state.css[css] = true;
		return state;
	}

	getDefaultProperties() {
		return {
			disabled: false,
			placeholder: '',
			grid: 12,
			name: null
		}
	}

	/**
	 * This method is called when getNode() method is called on an Input/Checkbox/etc component
	 * to get the actual input element that component represents and not the component DOM representation.
	 *
	 * Ex: <Input ref="firstName"/>
	 * Calling this.getNode('firstName') from parent component will return the actual <input> element inside the component
	 *
	 * If getDOMElement() is not implemented, the actual component DOM will be returned by default.
	 *
	 * @returns {HTMLElement}
	 */
	getDOMElement() {
		return this.getDOMNode().querySelector('input');
	}
}

export default Input;
