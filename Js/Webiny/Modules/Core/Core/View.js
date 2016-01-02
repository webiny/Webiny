import Component from './Component';

class View extends Component {

	constructor(props) {
		super(props);

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
}

export default View;