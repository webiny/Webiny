const container = {};

/**
 * UiDispatcher class keeps references to instances of React components globally, no matter the app or module.
 *
 * It allows us to expose public UI API and let developers implement different interactions between modules.
 * Every component that has a 'name' attribute on it will automatically register itself on 'componentWillMount'
 * and unregister on 'componentWillUnmount' events.
 */
class UiDispatcher {

    debug() {
        console.log(container);
    }

    register(name, instance) {
        if (_.has(container, name)) {
            return console.warn(`Component name '${name}' is already registered!`);
        }
        container[name] = instance;
        return this;
    }

    unregister(name) {
        delete container[name];
        return this;
    }

    get(name) {
        return container[name];
    }

    createSignal(_this, call, params) {
        return function executeSignal() {
            let callable = null;
            if (_.isFunction(call)) {
                callable = call;
            } else {
                const [name, method] = call.split(':');
                const component = name === 'this' ? _this : _.get(container, name);

                callable = component[method];
            }

            const signalParams = [];
            _.each(params, p => {
                if (_.startsWith(p, '@')) {
                    // Extract parameter definition
                    const param = _.trimLeft(p, '@');
                    if (p.indexOf(':') < 0) {
                        signalParams.push(_.get(container, param));
                    } else {
                        const [name, method] = param.split(':');
                        signalParams.push(container[name][method]);
                    }
                } else {
                    signalParams.push(p);
                }
            });

            let args = arguments;
            if (signalParams.length) {
                args = signalParams;
            }

            return Q(callable(...args)).then(result => result);
        };
    }
}

export default new UiDispatcher;
