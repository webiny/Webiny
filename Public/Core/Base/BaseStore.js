import EventManager from '/Core/EventManager';
import BaseClass from '/Core/Base/BaseClass';
import ApiService from '/Core/ApiService';

class BaseStore extends BaseClass {

	static createInstance() {
		var instance = new this;
		instance.init();
		return instance;
	}

	constructor() {
		this.data = {};
		var service = this.getService();
		if(service instanceof ApiService){
			this.api = service;
		} else {
			this.api = new ApiService(service);
		}
	}

	setInitialData(data) {
		this.data = data;
		this.emitChange();
	}

	emitChange() {
		EventManager.emit(this.getFqn(), this);
	}

	getService(){
		// Override to implement
		// return '/App/Module/Service'
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

	getData() {
		return this.data;
	}

	crudList(filters={}, sorters={}, limit=100, page=1) {
		return this.api.crudList(filters, sorters, limit, page);
	}

	crudCreate(data) {
		this.data.push(data);
		this.emitChange();

		return this.api.crudCreate(data).then((response) => {
			data.id = response.data.id;
			this.emitChange();
		});
	}

	crudDelete(index) {
		var item = this.data[index];
		this.data.splice(index, 1);
		this.emitChange();

		this.api.crudDelete(item.id);
	}

	crudGet() {

	}

	crudReplace() {

	}

	crudUpdate() {

	}
}

export default BaseStore;