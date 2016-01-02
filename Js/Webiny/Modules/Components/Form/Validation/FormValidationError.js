class FormValidationError extends Error {

	constructor(message, validator, value){
		super();
		this.message = message;
		this.validator = validator;
		this.value = value
	}

	getMessage(){
		return this.message;
	}

	getValidator(){
		return this.validator;
	}

	getValue(){
		return this.value;
	}

	setMessage(message){
		this.message = message;
		return this;
	}
}

export default FormValidationError;