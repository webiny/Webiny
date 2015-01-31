import BaseComponent from '/Core/Base/BaseComponent';

class FormInline extends BaseComponent {

	getTemplate(){ return '<form name={this.props.name} ref={this.props.name} className="form-inline">{this.props.children}</form>';
	}

	getFqn(){
		return 'Core.View.FormInline';
	}

	componentDidMount(){
		// Disable form submission
		var form = this.getDOMNode();
		$(form).submit(function (e) {
			e.preventDefault();
		});
	}
}

export default FormInline;
