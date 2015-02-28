import BaseComponent from '/Core/Base/BaseComponent';

class Input extends BaseComponent {

	getFqn() {
		return 'Core.View.Input';
	}

	getInitialState(){
		var css = 'col-sm-' + this.props.grid;

		var state = {
			css: {}
		};
		state.css[css] = true;
		return state;
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
		return React.findDOMNode(this).querySelector('input');
	}
}

Input.defaultProps = {
	disabled: false,
	placeholder: '',
	grid: 12,
	name: null
};

export default Input;
