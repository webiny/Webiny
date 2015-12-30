class EventManager {

	constructor() {
		this.listeners = {};
	}

	emit(event, data) {
        Webiny.Console.info("%c[Emit]: " + event, 'color: #1918DE; font-weight: bold', data);
		if (!this.listeners.hasOwnProperty(event)) {
            return Q(null);
		}

        // Execute before change callbacks in a chain
        var callbacksChain = Q(data);

        this.listeners[event].forEach(listener => {
            callbacksChain = callbacksChain.then(listener.listener);
        });

        return callbacksChain;
	}

	listen(event, listener, meta = false) {

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

    stopListening(event) {
        var index = this.listeners.indexOf(event);
        if (index > -1) {
            this.listeners.splice(index);
            return true;
        }
        return false;
    }

	getListeners() {
		return this.listeners;
	}
}
export default new EventManager();