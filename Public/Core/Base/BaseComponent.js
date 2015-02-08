import BaseClass from '/Core/Base/BaseClass';
import Router from '/Core/Router/Router';
import EventManager from '/Core/EventManager';
import StateStore from '/Core/Tools/StateStore';
import LinkState from '/Core/Tools/LinkState';
import Registry from '/Core/Registry';

/**
 * BaseComponent class is the main class all React components should inherit from.
 * It handles construction of a valid React class
 */
class BaseComponent extends React.Component {

	constructor() {
		this.dynamic = {};
		this.__listeners = [];
		this.__instanceId = Tools.createUID();

		// Auto-bind user defined methods
		Object.keys(this.__proto__).forEach(property => {
			if(typeof this[property] == 'function'){
				this[property] = this[property].bind(this);
			}
		});
	}

	render(){
		this.dynamic = this.getDynamicProperties();
		return this.getTemplate();
	}

	static createInstance() {
		return this;
	}

	getClassName() {
		return this.__proto__.constructor.name;
	}

	getRegistry() {
		return Registry;
	}

	getInstanceId() {
		return this.__instanceId;
	}

	getFqn() {
		return this.getClassName();
	}

	getPropertyTypes() {
		return {};
	}

	getDynamicProperties() {
		return {};
	}

	componentWillMount() {
		var saveState = this.props.saveState || false;
		if (saveState) {
			var state = StateStore.getState(this.getInstanceId());
			if (state) {
				this.state = state;
			}
		}
	}

	componentDidMount() {
		console.log(this.__instanceId);
	}

	componentWillReceiveProps(nextProps) {

	}

	shouldComponentUpdate() {
		return true;
	}

	componentWillUpdate(nextProps, nextState) {

	}

	componentDidUpdate(prevProps, prevState) {

	}

	componentWillUnmount() {
		var saveState = this.props.saveState || false;
		if (saveState) {
			StateStore.saveState(_this.getInstanceId(), this.state);
		}

		this.__listeners.forEach((unsubscribe) => {
			unsubscribe();
		});
		this.__listeners = [];
	}

	/**
	 * ############# CUSTOM COMPONENT METHODS ##############
	 */

	shouldSaveState() {
		return true;
	}

	trigger(action, data) {
		EventManager.emit(action, data || {});
	}

	/**
	 * Listen to data store change
	 * @param string store
	 * @param string|callable callback
	 * @returns {classObject}
	 */
	onStore(store, callback) {
		var callbackType = typeof callback;
		var reactThis = this;

		if (typeof store != 'string') {
			store = store.getFqn();
		}

		if (callbackType != 'function') {

			// State key is passed to assign new store value to
			if (callbackType == 'string') {
				var property = callback;
				callback = function (store) {
					var state = {};
					state[property] = store.getData();
					reactThis.setState(state);
				}
			}

			// New store value will overwrite the entire component state
			if (callbackType == 'undefined') {
				callback = function (store) {
					reactThis.setState(store.getData());
				}
			}
		}

		var meta = {
			listenerType: 'component',
			listeningTo: 'store',
			listenerName: reactThis.getFqn()
		};

		// Get store from registry to trigger its init() method if it has not yet been initialized
		_this.getRegistry().getStore(store);

		var stopListening = EventManager.addListener(store, callback, meta);
		this.__listeners.push(stopListening);
		return this;
	}

	/**
	 * Get DOM Node by React reference
	 * @param string key
	 * @returns {DOMElement}
	 */
	getNode(key) {
		if (typeof this.refs[key]['getDOMElement'] != 'undefined') {
			return this.refs[key].getDOMElement();
		}
		return this.refs[key].getDOMNode();
	}

	getStore(name) {
		return _this.getRegistry().getStore(name);
	}

	getParam(name) {
		return Router.getParam(name);
	}

	classSet(rules) {
		if (!rules) {
			return '';
		}

		if (typeof rules == 'string') {
			return rules;
		}
		return React.addons.classSet(rules);
	}

	/**
	 * Ex: onChangeImportant(newValue, oldValue){...}
	 * Ex: onChangeName(newValue, oldValue){...}
	 *
	 * @param key
	 * @returns {{value: *, requestChange: *}}
	 */
	linkState(key) {
		var ls = new LinkState(this, key);
		return ls.create();
	}
}

export default BaseComponent;