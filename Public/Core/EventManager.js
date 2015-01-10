class EventManager {

	constructor() {
		this.listeners = {};
	}

	emit(event, data) {
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

		return function(){
			_this.listeners[event].splice(itemIndex);
		}
	}

	getListeners() {
		return this.listeners;
	}

	getListenerTree(){
		var tree = [];
		var listeners = this.listeners;
		Object.keys(listeners).forEach(function (event) {
			var eventListeners = listeners[event];
			eventListeners.forEach((el) => {
				if(el.meta == undefined || el.meta.type == 'route'){
					return;
				}
				tree.push({
					source: el.meta.name,
					target: event,
					sourceType: types[el.meta.type],
					targetType: el.meta.type
				});
			});
		});
		return tree;
	}
}
export default new EventManager();