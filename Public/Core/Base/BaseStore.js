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
		EventManager.emit(this.getFQN(), this);
	}

	on(action, callback) {
		EventManager.addListener(action, callback);
	}

	init() {
		// Override to implement initial setup code
	}

	getFQN() {
		// Override to return fully qualified store name
	}

	getData() {
		return this.data;
	}
}

export default BaseStore;