import Http from '/Core/Http'

function initializeStore(store){
	store.instance.init();
	store.initialized = true;

	var source = store.instance.getSource();
	return Http.get(_apiUrl + source).then((res) => {
		if (!res.error) {
			store.instance.setInitialData(res.data);
		}
		return res.data;
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