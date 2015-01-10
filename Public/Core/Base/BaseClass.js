class Registry {

	constructor() {
		this.stores = {};
	}

	addStore(store){
		// TODO: check if it's an existing instance
		this.stores[store.getFqn()] = store;
	}

	getStore(name){
		return this.stores[name];
	}

	getStores(){
		return this.stores;
	}
}

var registry = new Registry();

class BaseClass {

	getClassName(){
		return this.__proto__.constructor.name;
	}

	getRegistry(){
		return registry;
	}
}

export default BaseClass;