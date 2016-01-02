import LinkState from './LinkState';
import Dispatcher from './Dispatcher';

class Component extends React.Component {

	constructor(props) {
		super(props);

		this.__listeners = [];
		this.__cursors = [];
		this.bindMethods('bindTo');
	}

	componentWillMount() {
		// Reserved for future system-wide functionality
	}

	componentDidMount() {
		// Reserved for future system-wide functionality
	}

	componentWillReceiveProps(nextProps) {
		// Reserved for future system-wide functionality
	}

	shouldComponentUpdate(nextProps, nextState) {
		// Reserved for future system-wide functionality
		return true;
	}

	componentWillUpdate(nextProps, nextState) {
		// Reserved for future system-wide functionality
	}

	componentDidUpdate(prevProps, prevState) {
		// Reserved for future system-wide functionality
	}

	componentWillUnmount() {
		// Release event listeners
		_.forEach(this.__listeners, unsubscribe => {
			unsubscribe();
		});
		this.__listeners = [];

		// Release data cursors
		_.forEach(this.__cursors, cursor => {
			cursor.release();
		});
		this.__cursors = [];
	}

	watch(key, func) {

		let cursor = Webiny.Model.select(key.split('.'));
		cursor.on('update', e => {
			func(e.data.currentData, e.data.previousData, e);
		});
		this.__cursors.push(cursor);
		return cursor;
	}

	setState(key, value = null, callback = null) {
		if (_.isObject(key)) {
			return super.setState(key, value);
		}

		if (_.isString(key)) {
			var state = this.state;
			_.set(state, key, value);
			return super.setState(state, callback);
		}
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
	bindTo(key) {
		var ls = new LinkState(this, key);
		return ls.create();
	}

	/**
	 * The same as React.render() except this one also checks if this.renderComponent(...) method
	 * was defined - which can be used to have Webiny components automatically injected
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

	isMobile() {
		return isMobile.any;
	}

	addKeys(elements) {
		return elements.map((el, index) => {
			if (!el) {
				return null;
			}
			return React.cloneElement(el, {key: index}, el.props.children);
		});
	}

	dispatch(action, data) {
		return Dispatcher.dispatch(action, data);
	}

	on(event, callback, meta) {
		var stopListening = Dispatcher.on(event, callback, meta);
		this.__listeners.push(stopListening);
	}

	onRouteChanged(callback) {
		var stopListening = Dispatcher.on('RouteChanged', callback);
		this.__listeners.push(stopListening);
	}

	inject(...components) {
		var injectables = [];
		components.forEach(commaSeparatedComponents => {
			commaSeparatedComponents.replace(/\s+/g, '').split(',').forEach(cmp => {
				injectables.push(_.get(Webiny.Ui.Components, cmp));
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
			if (_.get(Webiny.Ui.Components, param)) {
				injects.push(_.get(Webiny.Ui.Components, param));
			}
		});
		return injects;
	}

	getClassName() {
		return this.__proto__.constructor.name;
	}
}

export default Component;