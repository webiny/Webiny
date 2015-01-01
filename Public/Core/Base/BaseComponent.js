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

	wComponentWillMount() {

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

	wComponentWillUnmount() {

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
				// TODO: call super(), no need for extra method (test)
				var state = StateStore.getInstance().getState(_this.getInstanceId());
				if (state) {
					this.state = state;
				}
				_this.wComponentWillMount();
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
				StateStore.getInstance().saveState(_this.getInstanceId(), this.state);
				_this.wComponentWillUnmount();
			},

			trigger: function (action, data) {
				EventManager.emit(action, data);
			},

			on: function (store, callback) {
				return EventManager.addListener(store, callback);
			}
		};

		/**
		 * Create `render` method
		 */
		var _this = this;

		classObject.render = function () {
			if (!_this.__reactComponent) {
				/**
				 * Parse template for built-in tags
				 */
				var ReactComponentSource = _this.getTemplate();
				if (!ReactComponentSource.indexOf('React') == 0) {
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

		classObject['getInstanceId'] = _this.getInstanceId;
		classObject['__instanceId'] = _this.getInstanceId();

		return React.createClass(classObject);
	}
}

export default BaseComponent;