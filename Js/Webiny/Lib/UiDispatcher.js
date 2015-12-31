let container = {};

/**
 * UiDispatcher class keeps references to instances of React components globally, no matter the app or module.
 *
 * It allows us to expose public UI API and let developers implement different interactions between modules.
 * Every component that has a 'name' attribute on it will automatically register itself on 'componentWillMount'
 * and unregister on 'componentWillUnmount' events.
 */
class UiDispatcher {

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

	signal(_this, call, params = null, conditions = null) {
		return function () {
			let callable = null;
			if (_.isFunction(call)) {
				callable = call;
			} else {
				let [name, method] = call.split(':');
				let component = name == 'this' ? _this : _.get(container, name);
				callable = component[method];
			}

			// Build params: for now we only support one string as a parameter
			let signalParams = [];
			if (params !== null) {
				if (_.startsWith(params, '@')) {
					// Extract parameter definition
					let param = _.trimLeft(params, '@');
					if (param.indexOf(':') < 0) {
						signalParams.push(_.get(container, param));
					} else {
						let [name, method] = param.split(':');
						signalParams.push(container[name][method]);
					}
				} else {
					signalParams.push(params);
				}
			}

			let args = arguments;
			if (signalParams.length) {
				args = signalParams;
			}

			return Q(callable(...args)).then(result => {
				if (conditions) {
					_.forIn(conditions, (condition, call) => {
						// TODO: add better logic for handling conditions
						if (result === condition) {
							return _this.signal(call)(...args);
						}
					});
				}
				return result;
			});
		};
	}
}

export default new UiDispatcher;