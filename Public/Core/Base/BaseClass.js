class BaseClass {

	getClassName(){
		return this.__proto__.constructor.name;
	}
}

export default BaseClass;