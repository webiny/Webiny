import EventManager from '/Core/EventManager';
import Router from '/Core/Router/Router';
import BaseClass from '/Core/Base/BaseClass';
import ApiService from '/Core/Api/ApiService';

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
			EventManager.emit(this.getFqn(), this);
		}, delay);
	}

	getService() {
		// Override to implement
		// return '/App/Module/Service'
		return null;
	}

	setInitialData(data){
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

	getData(condition = null) {
		if(!condition){
			return Q.when(this.data);
		}

		if(this.data instanceof Array && condition instanceof Object){

			function entries(obj) {
				return (for (key of Object.keys(obj)) [key, obj[key]]);
			}

			var results = [];
			this.data.forEach((item) => {
				var matches = 0;
				for (let [key, value] of entries(condition)) {
					if(item[key] == value){
						matches++;
					}
				}
				if(matches == Object.keys(condition).length){
					results.push(item);
				}
			});
			return Q.when(results);
		}

		return Q.when(null);
	}

	/**
	 * Get router parameter
	 * @param name
	 * @returns String|null
	 */
	getParam(name){
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
				if(config.push){
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

		if(config.prePush){
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

			if(config.postPush){
				this.data.push(data);
			}
			
			if (config.emit) {
				this.emitChange();
			}
			return response;
		});
	}

	/**
	 * Delete record by given record object or record index in this.data
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


		if(config.remove) {
			this.data.splice(itemIndex, 1);
		}

		if(config.emit) {
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

	crudUpdate() {

	}
}

export default BaseStore;