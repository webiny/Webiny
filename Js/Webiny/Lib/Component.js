import LinkState from './LinkState';
import EventManager from './EventManager';
import Registry from './Registry';

class Component extends React.Component {

	constructor() {
		super();

		this.__listeners = [];
		this.bindMethods('linkState');
	}

	setState(key, value = null, callback = null){
		if(_.isObject(key)){
			return super.setState(key, value);
		}

		if(_.isString(key)){
			var state = this.state;
			_.set(state, key, value);
			return super.setState(state, callback);
		}
	}

	componentWillUnmount() {
		_.forEach(this.__listeners, unsubscribe => {
			unsubscribe();
		});
		this.__listeners = [];
	}

	bindMethods() {
        var args = arguments;
        if (arguments.length == 1 && _.isString(arguments[0])) {
            args = arguments[0].split(',').map(x => x.trim());
        }

		_.forEach(args, (name) => {
			if (name in this) {
				this[name] = this[name].bind(this);
			} else {
				console.info('Missing method [' + name + ']', this)
			}
		});
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

    /**
     * The same as React.render() except this one also checks if this.renderComponent(...) method
     * was defined - which can be used to have injects of RAD components automatically
     */
    render() {
        if (_.isFunction(this.renderComponent)) {
            var injects = this.getInjectedRadComponents(this.renderComponent);
            return this.renderComponent(...injects);
        }

    }

	classSet() {
		var classes = [];

		_.forIn(arguments, classObject => {
			if (!classObject) {
				return;
			}

			if (typeof classObject === 'string') {
				classes = classes.concat(classObject.split(' '));
				return;
			}

			if (classObject instanceof Array) {
				classes = classes.concat(classObject);
				return;
			}

			_.forIn(classObject, (value, className) => {
				if (!value) {
					return;
				}
				classes.push(className);
			});
		});

		return classes.join(' ');
	}

	isMobile(){
		return isMobile.any;
	}

	addKeys(elements) {
		return elements.map((el, index) => {
			if(!el){
				return null;
			}
			var props = {key: index};
			return React.cloneElement(el, props, el.props.children);
		});
	}

	trigger(action, data) {
		return EventManager.emit(action, data);
	}

	/**
	 * Listen to data store change
	 * @returns {classObject}
	 * @param store
	 * @param callback
	 * @param meta
	 */
	onStoreChanged(store, callback = null, meta = null) {

		if (typeof store != 'string') {
			store = store.getFqn();
		}

		if (!_.isFunction(callback)) {

			// State key name is passed to assign new data store value to that state key
			if (_.isString(callback)) {
				var property = callback;
				callback = (data) => {
					var state = _.set({}, property, data);
					this.setState(state);
				}
			}

			// New store value will overwrite the entire component state
			if (_.isNull(callback)) {
				callback = (data) => {
					this.setState(data);
				}
			}
		}

		var stopListening = EventManager.listen(store, callback, meta);
		this.__listeners.push(stopListening);

		// Get store from registry to trigger its init() method if it has not yet been initialized
		return Registry.getStore(store);
	}

    listen(event, callback, meta) {
        var stopListening = EventManager.listen(event, callback, meta);
        this.__listeners.push(stopListening);
    }

	onRouteChanged(callback) {
		var stopListening = EventManager.listen('RouteChanged', callback);
		this.__listeners.push(stopListening);
	}

	getStore(name) {
		return Registry.getStore(name);
	}

	/**
	 * Get DOM element of current component or of any child element/component referenced by ref
	 * @param ref Reference name (string) or null for current component
	 * @returns {*}
	 */
	getDOM(ref = null) {
		if (ref !== null) {
			if (this.refs[ref].getDOM) {
				return this.refs[ref].getDOM();
			}
			return ReactDOM.findDOMNode(this.refs[ref]);
		}
		return ReactDOM.findDOMNode(this);
	}

	inject(...components){
        var injectables = [];
		components.forEach(commaSeparatedComponents => {
            commaSeparatedComponents.replace(/\s+/g, '').split(',').forEach(cmp => {
                injectables.push(_.get(Webiny.Components, cmp));
            })
		});

        return injectables;
	}

	getParamNames(func) {
		var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
		var ARGUMENT_NAMES = /([^\s,]+)/g;
		var fnStr = func.toString().replace(STRIP_COMMENTS, '');
		var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
		if (result === null)
			result = [];
		return result;
	}

	getInjectedRadComponents(method) {
		var injects = [];
		this.getParamNames(method).forEach(param => {
			if (_.get(Webiny.Components, param)) {
				injects.push(_.get(Webiny.Components, param));
			}
		});
		return injects;
	}

	getClassName() {
		return this.__proto__.constructor.name;
	}
}

export default Component;