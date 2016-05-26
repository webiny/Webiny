class Dispatcher {

    constructor() {
        this.listeners = {};
    }

    dispatch(event, data) {
        // console.info('%c[Dispatch]: ' + event, 'color: #1918DE; font-weight: bold', data);
        if (!this.listeners.hasOwnProperty(event)) {
            return Q(null);
        }

        // Execute before change callbacks in a chain
        let callbacksChain = Q(data).then(res => res);

        this.listeners[event].forEach(listener => {
            callbacksChain = callbacksChain.then(listener.listener).catch(e => console.error(e));
        });

        return callbacksChain;
    }

    on(event, listener, meta = false) {
        if (!this.listeners.hasOwnProperty(event)) {
            this.listeners[event] = [];
        }
        const itemIndex = this.listeners[event].push({listener, meta}) - 1;
        const _this = this;

        return function off() {
            _this.listeners[event].splice(itemIndex);
        };
    }

    off(event) {
        const index = this.listeners.indexOf(event);
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
export default new Dispatcher();
