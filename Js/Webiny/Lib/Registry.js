function initializeStore(store) {
	store.instance.init();
	store.initialized = true;
	store.instance.$loadInitialData();
}

class Registry {

	constructor() {
		this.data = {};
		this.stores = {};
	}

	set(key, data) {
		_.set(this.data, key, data);
		return this;
	}

	get(key) {
		return _.get(this.data, key, null);
	}

	addStore(store, meta = {initialized: false}) {
		if (!this.stores.hasOwnProperty(store.getFqn())) {
			meta.instance = store;
			initializeStore(meta);
			this.stores[store.getFqn()] = meta;
		}
		return this;
	}

	getStore(name) {
		if (!_.has(this.stores, name)) {
			Webiny.Console.error('Store `' + name + '` does not exist!');
			return false;
		}
		return this.stores[name].instance;
	}
}

export default new Registry;