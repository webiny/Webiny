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
		this.__listeners = [];
		this.__instanceId = Tools.createUID();
	}

	static createComponent() {
		return (new this).getComponent();
	}

	static createElement(props = {}) {
		if (!props.hasOwnProperty('key')) {
			props.key = Tools.createUID();
		}
		var cmp = (new this).getComponent();
		return React.createElement(cmp, props);
	}

	getInstanceId() {
		return this.__instanceId;
	}

	getFqn() {
		return this.getClassName();
	}

	getInitialState() {
		return {};
	}

	getDefaultProperties() {
		return {};
	}

	getDynamicProperties() {
		return {};
	}

	componentDidMount() {

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

	}

	getComponents() {
		return {};
	}

	getComponent() {
		var _this = this;

		/**
		 * React class object
		 */
		var classObject = {
			/**
			 * Component instance ID (to be able to track this particular element)
			 */
			__instanceId: _this.getInstanceId(),

			/**
			 * Listeners registered in this component
			 */
			__listeners: _this.__listeners,

			/**
			 * This property is used for storing dynamically calculated properties that will be used in template
			 */
			dynamic: {},
			/**
			 * @see http://facebook.github.io/react/docs/component-specs.html#getinitialstate
			 */
			getInitialState: this.getInitialState,

			/**
			 * @see http://facebook.github.io/react/docs/component-specs.html#getdefaultprops
			 */
			getDefaultProps: this.getDefaultProperties,

			/**
			 * Get dynamic properties object
			 */
			getDynamicProperties: this.getDynamicProperties,

			/**
			 * @see http://facebook.github.io/react/docs/component-specs.html#mounting-componentwillmount
			 */
			componentWillMount: function () {
				var saveState = this.props.saveState || false;
				if (saveState) {
					var state = StateStore.getState(_this.getInstanceId());
					if (state) {
						this.state = state;
					}
				}
			},

			/**
			 * @see http://facebook.github.io/react/docs/component-specs.html#mounting-componentdidmount
			 */
			componentDidMount: this.componentDidMount,

			/**
			 * @see http://facebook.github.io/react/docs/component-specs.html#updating-componentwillreceiveprops
			 * @param object nextProps
			 */
			componentWillReceiveProps: this.componentWillReceiveProps,

			/**
			 * @see http://facebook.github.io/react/docs/component-specs.html#updating-shouldcomponentupdate
			 */
			shouldComponentUpdate: this.shouldComponentUpdate,

			/**
			 * @see http://facebook.github.io/react/docs/component-specs.html#updating-componentwillupdate
			 * @param object nextProps
			 * @param object nextState
			 */
			componentWillUpdate: this.componentWillUpdate,

			/**
			 * @see http://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
			 * @param object prevProps
			 * @param object prevState
			 */
			componentDidUpdate: this.componentDidUpdate,

			/**
			 * @see http://facebook.github.io/react/docs/component-specs.html#unmounting-componentwillunmount
			 */
			componentWillUnmount: function () {
				var saveState = this.props.saveState || false;
				if (saveState) {
					StateStore.saveState(_this.getInstanceId(), this.state);
				}

				this.__listeners.forEach((unsubscribe) => {
					unsubscribe();
				});
				this.__listeners = [];
			},

			trigger: function (action, data) {
				EventManager.emit(action, data || {});
			},

			/**
			 * Listen to data store change
			 * @param string store
			 * @param string|callable callback
			 * @returns {classObject}
			 */
			onStore: function (store, callback) {
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
				reactThis.__listeners.push(stopListening);
				return reactThis;
			},

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
			},

			getStore(name) {
				return _this.getRegistry().getStore(name);
			},

			getParam(name) {
				return Router.getParam(name);
			},

			classSet(rules) {
				if (!rules) {
					return '';
				}

				if (typeof rules == 'string') {
					return rules;
				}
				return React.addons.classSet(rules);
			},

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
		};

		/**
		 * Create `render` method
		 */
		classObject.render = function () {
			console.log("RENDERING " + _this.getClassName(), _this.__instanceId);
			this.dynamic = this.getDynamicProperties();
			return this.getTemplate();
		}

		/**
		 * Almost done...
		 * Take all methods that are not part of React wrapper and assign them to React classObject so that
		 * they are available from `this` in React component
		 */
		var prototype = this.__proto__;
		Object.keys(prototype).forEach(function (key) {
			if (!classObject.hasOwnProperty(key)) {
				classObject[key] = prototype[key];
			}
		});

		return React.createClass(classObject);
	}
}

export default BaseComponent;