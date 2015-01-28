import BaseComponent from '/Core/Base/BaseComponent';

class Input extends BaseComponent {

	getFqn(){
		return 'Core.View.Input';
	}

	getDefaultProperties(){
		return {
			disabled: false,
			placeholder: '',
			label: ''
		}
	}
}

export default Input;
