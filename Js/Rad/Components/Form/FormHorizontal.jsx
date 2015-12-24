import Form from './FormVertical';

class FormHorizontal extends Form {

	constructor() {
		super();
	}

	getFormType() {
		return 'horizontal';
	}

	getFormClass() {
		return 'form-horizontal';
	}
}

export default FormHorizontal;
