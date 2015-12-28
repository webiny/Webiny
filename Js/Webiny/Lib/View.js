import Component from './Component';

class View extends Component {

	constructor() {
		super();

		this.bindMethods('createOptions');
	}

	/**
	 * Create key=>value options for checkbox/radio/dropdown
	 * @param store Name of the store to use or array of entities to iterate
	 * @param stateKey State key to assign generated object
	 * @param key Property name to use as 'key'
	 * @param value Property name to use as 'value'
	 */
	createOptions(store, stateKey, key, value) {
		if (_.isEmpty(store)) {
			store = [];
		}

		var data = null;
		if (_.isArray(store)) {
			data = Q({data: store});
		} else {
			data = this.getStore(store).getState();
		}
		return data.then(data => {
			var items = {};
			_.each(data.data, item => {
				let option = _.isFunction(value) ? value(item) : item[value];
				if (!_.isString(option)) {
					option = ReactDOMServer.renderToStaticMarkup(option);
				}
				items[item[key]] = option;
			});

			var partialState = this.state;
			_.set(partialState, stateKey, items);
			this.setState(partialState);
			return data.data;
		});
	}

	signal(call, params = null, conditions = null) {
		let _this = this;
		return function () {
			let callable = null;
			if (_.isFunction(call)) {
				callable = call;
			} else {
				let [name, method] = call.split(':');
				let component = name == 'this' ? _this : _.get(_this.refs, name);
				callable = component[method];
			}

			// Build params: for now we only support one string as a parameter
			let signalParams = [];
			if (params !== null){
				if(_.startsWith(params, '@')) {
					// Extract parameter definition
					let param = _.trimLeft(params, '@');
					if (param.indexOf(':') < 0) {
						signalParams.push(_.get(_this.refs, param));
					} else {
						let [name, method] = param.split(':');
						signalParams.push(_this.refs[name][method]);
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

export default View;