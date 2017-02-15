import Webiny from 'Webiny';
import LinkState from './LinkState';
import Dispatcher from './Dispatcher';
import UiDispatcher from './UiDispatcher';
import md5 from 'blueimp-md5';
import isMobile from 'ismobilejs';

class Component extends React.Component {

    constructor(props) {
        super(props);

        this.__listeners = [];
        this.__cursors = [];
        this.__mounted = true;
        this.bindMethods('bindTo,isRendered');

        /**
         * Method for a more convenient use of i18n module - this will automatically generate a complete namespace for the label
         * If this method is called without parameters, it will return Webiny.i18n module, from which you can use other functions as well
         * @param label
         * @param variables
         * @param options
         * @returns {*}
         */
        this.i18n = (label, variables, options = {}) => {
            if (!label) {
                return Webiny.i18n;
            }

            let key = options.key || this.i18n.key;
            if (!key) {
                const app = _.get(Webiny.Router.getActiveRoute(), 'module.app.name');
                const module = _.get(Webiny.Router.getActiveRoute(), 'module.name');
                key = `${app}.${module}.${this.getClassName()}`;
            }

            key = _.trimEnd(key, '.') + '.' + md5(label);
            return Webiny.i18n.render(key, label, variables, options);
        };

        /**
         * If set, it will be used in the component instead of dynamically created key
         * @type {null}
         */
        this.i18n.key = null;
    }

    componentWillMount() {
        if (this.props.ui) {
            UiDispatcher.register(this.props.ui, this);
        }
    }

    componentDidMount() {
        // Reserved for future system-wide functionality
    }

    /* eslint-disable */
    componentWillReceiveProps(nextProps) {
        if (nextProps.ui != this.props.ui) {
            UiDispatcher.unregister(this.props.ui);
            UiDispatcher.register(nextProps.ui, this);
        }
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

    /* eslint-enable */

    componentWillUnmount() {
        // Release event listeners
        _.forEach(this.__listeners, unsubscribe => {
            unsubscribe();
        });
        this.__listeners = [];

        // Release data cursors
        _.forEach(this.__cursors, cursor => {
            if (cursor && cursor.tree) {
                cursor.release();
            }
        });
        this.__cursors = [];

        if (this.props.ui) {
            UiDispatcher.unregister(this.props.ui);
        }
        this.__mounted = false;
    }

    setState(key, value = null, callback = null) {
        if (!this.isMounted()) {
            return;
        }

        if (_.isObject(key)) {
            return super.setState(key, value);
        }

        if (_.isString(key)) {
            const state = this.state;
            _.set(state, key, value);
            return super.setState(state, callback);
        }
    }

    isMounted() {
        return this.__mounted;
    }

    isRendered() {
        if (_.has(this.props, 'renderIf')) {
            return _.isFunction(this.props.renderIf) ? this.props.renderIf() : this.props.renderIf;
        }
        return true;
    }

    getClassName() {
        return Object.getPrototypeOf(this).constructor.name;
    }

    isMobile() {
        return isMobile.any;
    }

    dispatch(action, data) {
        return Dispatcher.dispatch(action, data);
    }

    on(event, callback, meta) {
        const stopListening = Dispatcher.on(event, callback, meta);
        this.__listeners.push(stopListening);
        return stopListening;
    }

    classSet(...sets) {
        let classes = [];

        _.forIn(sets, classObject => {
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

    /**
     * Ex: onChangeImportant(newValue, oldValue){...}
     * Ex: onChangeName(newValue, oldValue){...}
     *
     * @param key
     * @param callback
     * @param defaultValue
     * @returns {{value: *, onChange: *}}
     */
    bindTo(key, callback = _.noop, defaultValue = null) {
        const ls = new LinkState(this, key, callback, _.clone(defaultValue));
        return ls.create();
    }

    bindMethods(...methods) {
        if (methods.length === 1 && _.isString(methods[0])) {
            methods = methods[0].split(',').map(x => x.trim());
        }

        _.forEach(methods, (name) => {
            if (name in this) {
                this[name] = this[name].bind(this);
            } else {
                console.info('Missing method [' + name + ']', this);
            }
        });
    }

    ui(call, ...params) {
        if (call.indexOf(':') < 0) {
            return UiDispatcher.get(call);
        }
        return UiDispatcher.createSignal(this, call, params);
    }

    watch(key, func) {
        const cursor = Webiny.Model.select(key.split('.'));
        cursor.on('update', e => {
            func(e.data.currentData, e.data.previousData, e);
        });
        this.__cursors.push(cursor);
        // Execute callback with initial data
        func(cursor.get());
        return cursor;
    }

    apiParams(params) {
        // TODO: need a simple Injector (like current Registry)
        // TODO: Things like `apiParams` will be constructed using a form in UI builder
        // TODO: values like '@activeLocation' will be dynamic, and are accessed through injector
        // TODO: Modules responsible for these values should make these values available to injector on module initialization
        const injected = {};
        _.each(params, (v, k) => {
            if (_.isPlainObject(v)) {
                injected[k] = this.apiParams(v);
                return;
            }

            if (_.isString(v) && v.startsWith('@')) {
                const parts = v.split(':');
                if (parts[0] === '@router') {
                    v = Webiny.Router.getParams(parts[1]);
                }
            }
            injected[k] = v;
        });
        return injected;
    }

    render() {
        if (!this.isRendered()) {
            return null;
        }

        if (this.props.renderer) {
            try {
                // Here we prepare renderer parameters in case any were attached to the function itself using `bindArgs`
                let params = [this];
                if (this.props.renderer.bindArgs) {
                    params = params.concat(this.props.renderer.bindArgs);
                }
                params.push(this);
                return this.props.renderer.call(...params);
            } catch (e) {
                Webiny.Logger.reportError('js', e.message, e.stack);
                if (webinyEnvironment === 'production') {
                    return null;
                }
                console.error('[RENDER ERROR][' + this.getClassName() + ']', e);
                return (
                    <div className="porlet porlet-primary">
                        <div className="porlet-header">
                            <h3>[RENDER ERROR] in component `{this.getClassName()}`</h3>
                        </div>
                        <div className="porlet-body">
                            <pre>{e.stack}</pre>
                        </div>
                    </div>
                );
            }
        }

        console.warn('Component ' + this.getClassName() + ' has no renderer!');
        return null;
    }
}

Component.defaultProps = {};

export default Component;
