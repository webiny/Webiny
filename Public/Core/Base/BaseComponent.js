import BaseClass from '/Core/Base/BaseClass';
import Router from '/Core/Router/Router';
import EventManager from '/Core/EventManager';
import ComponentLoader from '/Core/ComponentLoader';
import StateStore from '/Core/Tools/StateStore';
import LinkState from '/Core/Tools/LinkState';

/**
 * BaseComponent class is the main class all React components should inherit from.
 * It handles construction of a valid React class
 */
class BaseComponent extends BaseClass {

	constructor() {
		this.__listeners = [];
		this.__instanceId = Tools.createUID();
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

	shouldSaveState(){
		return true;
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
				var saveState = this.props.saveState || false;
				if(saveState){
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
				if(saveState){
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
				if(typeof this.refs[key]['getDOMElement'] != 'undefined' ){
					return this.refs[key].getDOMElement();
				}
				return this.refs[key].getDOMNode();
			},

			getStore(name) {
				return _this.getRegistry().getStore(name);
			},

			getParam(name){
				return Router.getParam(name);
			},

			classSet(rules){
				if(!rules){
					return '';
				}

				if(typeof rules == 'string'){
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
			linkState(key){
				var ls = new LinkState(this, key);
				return ls.create();
			}
		};

		/**
		 * Create `render` method
		 */
		classObject.render = function () {
			if (!_this.__reactComponent) {
				/** This is required for inline usage of components */
				var components = _this.getComponents();
				var keys = [];
				var values = [];

				Object.keys(components).forEach(function (key) {
					keys.push(key);
					values.push(components[key]);
				});

				for (let [i, element] of keys.entries()) {
					window[element] = values[i];
				}
				/** /Inline usage */

				/** Store local reference to compiled react component */
				_this.__reactComponent = _this.getTemplate();
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