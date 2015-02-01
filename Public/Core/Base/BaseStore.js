import EventManager from '/Core/EventManager';
import Router from '/Core/Router/Router';
import BaseClass from '/Core/Base/BaseClass';
import Tools from '/Core/Tools/Tools';
import ApiService from '/Core/Api/ApiService';

/**
 * Base class for all data stores
 */
class BaseStore extends BaseClass {

	static createInstance() {
		var instance = new this;
		instance.init();
		return instance;
	}

	constructor() {
		this.data = {};
		var service = this.getService();
		if (service instanceof ApiService) {
			this.api = service;
		} else {
			this.api = new ApiService(service);
		}
	}

	emitChange(delay = false) {
		setTimeout(() => {
			this.getData().then(data => {
				EventManager.emit(this.getFqn(), data);
			});
		}, delay);
	}

	getService() {
		// Override to implement
		// return '/App/Module/Service'
		return null;
	}

	setInitialData(data) {
		// Unset all object properties but keep an object reference
		Object.keys(this.data).map((key) => {
			delete this.data[key];
		});

		// Assign response data to the original object reference
		Object.assign(this.data, data);
		this.emitChange();
		return this;
	}

	getInitialData() {
		return Q.when(null);
	}

	onAction(action, callback) {
		var meta = {
			listenerType: 'store',
			listeningTo: 'action',
			listenerName: this.getFqn()
		};
		EventManager.addListener(action, callback.bind(this), meta);
	}

	onStore(store, callback) {
		var meta = {
			listenerType: 'store',
			listeningTo: 'store',
			listenerName: this.getFqn()
		};
		EventManager.addListener(store, callback, meta);
	}

	init() {
		// Override to implement initial setup code
	}

	getData(conditions = null) {
		if (!conditions) {
			return Tools.createPromise(this.data);
		}

		if (!conditions instanceof Object) {
			throw new Error('Conditions must be in form of an Object! ' + typeof conditions + ' given.');
		}

		if (this.data instanceof Array) {
			return Tools.createPromise(DataFilter.filter(this.data, conditions));
		}

		return Tools.createPromise(null);
	}

	/**
	 * Get router parameter
	 * @param name
	 * @returns String|null
	 */
	getParam(name) {
		return Router.getParam(name);
	}

	/**
	 * @param Object options filters, sorters, limit, page
	 * @returns {*}
	 */
	crudList(options = {}) {
		var defaultOptions = {
			filters: {},
			sorters: {},
			limit: 100,
			page: 1,
			emit: true,
			push: true
		};

		// Final config
		var config = {};

		// Merge default options with options from arguments
		Object.assign(config, defaultOptions, options);

		return this.api.crudList(config).then((response) => {
			if (!response.error) {
				if (config.push) {
					// Unset all object properties but keep an object reference
					Object.keys(this.data).map((key) => {
						delete this.data[key];
					});

					// Assign response data to the original object reference
					Object.assign(this.data, response.data);
				}

				if (config.emit) {
					this.emitChange();
				}
			}
			return response;
		});
	}

	/**
	 * Create record from given Object
	 *
	 * Creates a record by calling the API, and pushes the new record to this.data
	 * on success. This method also calls this.emitChange() for you.
	 *
	 * @param Object data Object data to create
	 * @returns Promise
	 */
	crudCreate(data, options = {}) {
		var defaultOptions = {
			prePush: true,
			postPush: false,
			emit: true
		};

		// Final config
		var config = {};

		// Merge default options with options from arguments
		Object.assign(config, defaultOptions, options);

		if (config.prePush) {
			config.postPush = false;
			this.data.push(data);
			this.emitChange();
		}

		return this.api.crudCreate(data).then((response) => {
			// Unset all object properties but keep an object reference
			Object.keys(data).map((key) => {
				delete data[key];
			});

			// Assign response data to the original object reference
			Object.assign(data, response.data);

			if (config.postPush) {
				this.data.push(data);
			}

			if (config.emit) {
				this.emitChange();
			}
			return response;
		});
	}

	/**
	 * TODO: delete by ID, not index
	 * Delete record by given record object or ID
	 * @param Object|number item Object or index to delete
	 * @returns Promise
	 */
	crudDelete(item, options = {}) {
		var item = item instanceof Object ? item : this.data[item];
		var itemIndex = this.data.indexOf(item);

		var defaultOptions = {
			remove: true,
			emit: true
		};

		// Final config
		var config = {};

		// Merge default options with options from arguments
		Object.assign(config, defaultOptions, options);


		if (config.remove) {
			this.data.splice(itemIndex, 1);
		}

		if (config.emit) {
			this.emitChange();
		}

		return this.api.crudDelete(item.id);
	}

	crudGet(id) {
		var id = id instanceof Object ? id.id : id;
		return this.api.crudGet(id);
	}

	crudReplace() {

	}

	crudUpdate(id, data) {
		if (id instanceof Object) {
			data = id;
			id = id.id;
		}

		return this.api.crudUpdate(id, data).then(response => {
			if (!response.error) {
				this.getData().then(storeData => {
					storeData.forEach((item, index) => {
						if (item.id == id) {
							Object.assign(this.data[index], data);
							this.emitChange();
						}
					});
				});
				return response;
			}
		});
	}
}


/**
 * DataFilter class is used only for filtering given data objects by given conditions
 */
class DataFilter {

	filter(data, conditions) {
		var results = [];
		data.forEach((item) => {
			var matches = 0;

			Object.keys(conditions).forEach((key) => {
				if (item[key] == conditions[value]) {
					matches++;
				}
			});

			if (matches == Object.keys(conditions).length) {
				results.push(item);
			}
		});
		return results;
	}
}

export default BaseStore;