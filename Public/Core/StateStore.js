class StateStore {

	constructor() {
		this.states = {};
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

export default new StateStore;