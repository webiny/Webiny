let singleton = Symbol();
let singletonEnforcer = Symbol();

class EventManager {

	constructor(enforcer) {
		if (enforcer != singletonEnforcer) throw "Cannot construct singleton";
		this.listeners = [];
	}

	static getInstance() {
		if (!this[singleton]) {
			this[singleton] = new EventManager(singletonEnforcer);
		}
		return this[singleton];
	}

	emit(event, data) {
		//console.info("[EVENT MANAGER] (Emit): "+event, data);
		if (!this.listeners.hasOwnProperty(event)) {
			return null;
		}

		var results = [];
		this.listeners[event].forEach((listener) => {
			if (typeof listener == 'function') {
				results.push(listener(data));
			} else {
				results.push(listener[0][listener[1]](data));
			}
		});
		return results;
	}

	addListener(event, listener) {
		if (!this.listeners.hasOwnProperty(event)) {
			this.listeners[event] = [];
		}
		this.listeners[event].push(listener);
	}

	getListeners() {
		return this.listeners;
	}
}

export default EventManager.getInstance();