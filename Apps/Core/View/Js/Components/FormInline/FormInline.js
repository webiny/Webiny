import BaseComponent from '/Core/Base/BaseComponent';

class FormInline extends BaseComponent {

	getFqn(){
		return 'Core.View.FormInline';
	}

	componentDidMount(){
		// Disable form submission
		var form = this.getNode(this.props.name);
		$(form).submit(function (e) {
			e.preventDefault();
		});
	}
}

export default FormInline;
