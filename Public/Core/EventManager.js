class EventManager {

	constructor() {
		this.listeners = {};
	}

	emit(event, data, asPromise = false) {
		//console.info("[EVENT MANAGER] (Emit): "+event, data);
		if (!this.listeners.hasOwnProperty(event)) {
			return null;
		}

		var results = [];
		this.listeners[event].forEach((listener) => {
			if (typeof listener.listener == 'function') {
				results.push(listener.listener(data));
			}
		});
		if (asPromise) {
			return Q.all(results);
		}
		return results;

	}

	addListener(event, listener, meta) {
		if (!this.listeners.hasOwnProperty(event)) {
			this.listeners[event] = [];
		}
		var itemIndex = this.listeners[event].push({
				listener: listener,
				meta: meta
			}) - 1;

		var _this = this;

		return function () {
			_this.listeners[event].splice(itemIndex);
		}
	}

	getListeners() {
		return this.listeners;
	}

	getListenerTree() {
		var tree = [];
		var listeners = this.listeners;
		Object.keys(listeners).forEach(function (event) {
			var eventListeners = listeners[event];
			eventListeners.forEach((el) => {
				if (el.meta == undefined || el.meta.listenerType == 'route') {
					return;
				}
				tree.push({
					source: el.meta.listenerName,
					target: event,
					sourceType: el.meta.listenerType,
					targetType: el.meta.listeningTo
				});
			});
		});
		return tree;
	}
}
export default new EventManager();