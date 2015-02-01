import BaseComponent from '/Core/Base/BaseComponent';

class Form extends BaseComponent {

	getTemplate(){ return "<form name={this.props.name} ref={this.props.name} className=\"form-horizontal\">{this.props.children}<\/form>";}

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
