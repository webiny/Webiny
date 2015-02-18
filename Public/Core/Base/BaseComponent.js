import BaseClass from '/Core/Base/BaseClass';
import BaseReactComponent from '/Core/Base/BaseReactComponent';
import Router from '/Core/Router/Router';
import EventManager from '/Core/EventManager';
import StateStore from '/Core/Tools/StateStore';
import LinkState from '/Core/Tools/LinkState';
import Registry from '/Core/Registry';

/**
 * BaseComponent class is the main class all React components should inherit from.
 * It handles construction of a valid React class
 */
class BaseComponent extends BaseClass {

	constructor() {
		this.dynamic = {};
		this.__listeners = [];
		this.__reactComponent = null;
		this.__instanceId = Tools.createUID();
	}

	getComponent(){
		var classObject = Object.create(BaseReactComponent);

		var prototype = this.__proto__;
		Object.keys(prototype).forEach(function (key) {
			if (!classObject.hasOwnProperty(key)) {
				classObject[key] = prototype[key];
			}
		});

		var _this = this;
		classObject['__instanceId'] = this.getInstanceId();
		classObject['__listeners'] = this.__listeners;
		classObject['render'] = function(){
			this.dynamic = _this.getDynamicProperties();
			if(!this.__reactComponent){
				this.__reactComponent = this.getTemplate();
			}
			console.log(this.__reactComponent)
			return this.__reactComponent;
		};

		var reactClass = React.createClass(classObject);
		return reactClass;
	}

	static createInstance() {
		return (new this).getComponent();
	}

	getInstanceId() {
		return this.__instanceId;
	}

	getFqn() {
		return this.getClassName();
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
		console.log(this.getClassName(), this.__instanceId);
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
			StateStore.saveState(this.getInstanceId(), this.state);
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
		var ref = this.refs[key] || false;
		if (!ref) {
			return false;
		}
		if (typeof ref['getDOMElement'] != 'undefined') {
			return ref.getDOMElement();
		}
		return ref.getDOMNode();
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