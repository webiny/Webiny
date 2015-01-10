import BaseClass from '/Core/Base/BaseClass';
import TemplateParser from '/Core/TemplateParser';
import EventManager from '/Core/EventManager';
import ComponentLoader from '/Core/ComponentLoader';
import StateStore from '/Core/StateStore';

/**
 * BaseComponent class is the main class all React components should inherit from.
 * It handles construction of a valid React class
 */
class BaseComponent extends BaseClass {

	constructor() {
		this.__listeners = [];
		this.__instanceId = function () {
			var delim = '-';

			function S4() {
				return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
			}

			return S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4();
		}();
	}

	static createInstance() {
		return (new this).getComponent();
	}

	getInstanceId() {
		return this.__instanceId;
	}

	getFqn(){
		return this.getClassName();
	}

	getPropertyTypes() {
		return {};
	}

	getMixins() {
		return [];
	}

	getStaticMethods() {
		return {};
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

		var classObject = {
			/**
			 * This property is used for storing dynamically calculated properties that will be used in template
			 */
			dynamic: {},
			/**
			 * @see http://facebook.github.io/react/docs/component-specs.html#proptypes
			 */
			propTypes: this.getPropertyTypes(),

			/**
			 * @see http://facebook.github.io/react/docs/component-specs.html#mixins
			 */
			mixins: this.getMixins(),

			/**
			 * @see http://facebook.github.io/react/docs/component-specs.html#statics
			 */
			statics: this.getStaticMethods(),

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
				var state = StateStore.getState(_this.getInstanceId());
				if (state) {
					this.state = state;
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
				StateStore.saveState(_this.getInstanceId(), this.state);
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
			on: function (store, callback) {
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
					type: 'component',
					name: reactThis.getFqn()
				};
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
				return this.refs[key].getDOMNode();
			},

			getStore(name) {
				return _this.getRegistry().getStore(name);
			}
		};

		/**
		 * Create `render` method
		 */
		classObject.render = function () {
			if (!_this.__reactComponent) {
				/**
				 * Parse template for built-in tags
				 */
				var ReactComponentSource = _this.getTemplate();
				if (ReactComponentSource.indexOf('React') != 0) {
					/**
					 * Generate React JS code from string template
					 */
					ReactComponentSource = JSXTransformer.transform(TemplateParser.parse(ReactComponentSource)).code;
				}

				console.groupCollapsed("Compiled component - " + _this.getClassName() + ' ' + _this.getInstanceId());
				console.log(ReactComponentSource);
				console.groupEnd();

				/** This is required for inline usage of components */
				var components = _this.getComponents();
				console.info("Components", components);
				var keys = [];
				var values = [];

				Object.keys(components).forEach(function (key) {
					keys.push(key);
					values.push(components[key]);
				});

				for (let [i, element] of keys.entries()) {
					window[element] = values[i];
				}

				/** Store local reference to compiled react component */
				_this.__reactComponent = ReactComponentSource;
			}

			this.dynamic = this.getDynamicProperties();
			return eval(_this.__reactComponent);
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

		classObject['__instanceId'] = _this.getInstanceId();
		classObject['__listeners'] = _this.__listeners;

		return React.createClass(classObject);
	}
}

export default BaseComponent;