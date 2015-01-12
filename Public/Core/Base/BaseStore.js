import EventManager from '/Core/EventManager';
import BaseClass from '/Core/Base/BaseClass';

class BaseStore extends BaseClass {

	static createInstance(){
		var instance = new this;
		instance.init();
		return instance;
	}

	constructor() {
		this.data = {};
	}

	emitChange() {
		EventManager.emit(this.getFqn(), this);
	}

	onAction(action, callback) {
		var meta = {
			listenerType: 'store',
			listeningTo: 'action',
			listenerName: this.getFqn()
		};
		EventManager.addListener(action, callback, meta);
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
}

export default BaseStore;