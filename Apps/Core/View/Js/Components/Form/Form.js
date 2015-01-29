import BaseComponent from '/Core/Base/BaseComponent';

class Form extends BaseComponent {

	getFqn(){
		return 'Core.View.Form';
	}

	componentDidMount(){
		// Disable form submission
		var form = this.getDOMNode();
		$(form).submit(function (e) {
			e.preventDefault();
		});
	}
}

export default Form;
