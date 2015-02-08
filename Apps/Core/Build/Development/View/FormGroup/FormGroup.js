import BaseComponent from '/Core/Base/BaseComponent';

class FormGroup extends BaseComponent {

	getTemplate(){ return "React.createElement(\"div\", {className: \"form-group\"}, this.props.children)";}

	getFqn(){
		return 'Core.View.FormGroup';
	}
}

export default FormGroup;
