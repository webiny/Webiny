import BaseComponent from '/Core/Base/BaseComponent';

class FormGroup extends BaseComponent {

	getTemplate(){ return '<div className="form-group">{this.props.children}</div>';
	}

	getFqn(){
		return 'Core.View.FormGroup';
	}
}

export default FormGroup;
