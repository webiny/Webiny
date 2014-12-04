let singleton = Symbol();
let singletonEnforcer = Symbol();

class StateStore {

	constructor(enforcer) {
		if (enforcer != singletonEnforcer) throw "Cannot construct singleton";
		this.states = {};
	}

	static getInstance() {
		if (!this[singleton]) {
			this[singleton] = new StateStore(singletonEnforcer);
		}
		return this[singleton];
	}

	saveState(key, state) {
		this.states[key] = state;
	}

	getState(key) {
		if (this.states.hasOwnProperty(key)) {
			return this.states[key];
		}
		return null;
	}
}

export default StateStore;