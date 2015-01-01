import EventManager from '/Core/EventManager';
import BaseClass from '/Core/Base/BaseClass';

class BaseStore extends BaseClass {

	emitChange() {
		EventManager.emit(this.getFQN(), this.data);
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
}

export default BaseStore;