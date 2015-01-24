import Http from '/Core/Http'

function initializeStore(store){
	store.instance.init();
	store.initialized = true;

	return store.instance.getInitialData().then((data) => {
		store.instance.setInitialData(data);
	});
}

class Registry {

	constructor() {
		this.stores = {};
	}

	addStore(store, meta) {
		if (!this.stores.hasOwnProperty(store)) {
			meta.instance = store;
			this.stores[store.getFqn()] = meta;
		}
	}

	getStore(name) {
		var store = this.stores[name];
		if (!store.initialized) {
			initializeStore(store);
		}
		return store.instance;
	}
}

export default new Registry;