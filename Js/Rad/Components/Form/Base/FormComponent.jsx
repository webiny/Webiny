import Component from './../../../Lib/Component';

class FormComponent extends Component {

	constructor(){
		super();
		this.bindMethods('getFormType');
	}

	getFormType(defaultType = 'native'){
		if(this.props.context){
			return this.props.context;
		}
		return this.props.form ? this.props.form.getFormType() : defaultType;
	}
}

export default FormComponent;