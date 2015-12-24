import EventManager from './../EventManager';
import Router from './../Router/Router';
import Tools from './../Tools';
import ApiService from './../Api/Service';
import ApiResponse from './../Api/Response';

/**
 * Base class for all data stores
 */
class BaseStore {

    constructor() {
        this.$loader = null;
        this.$loadingInitialData = false;
        this.state = this.getDefaultState();
    }

    getDefaultState() {
        return {};
    }

    setDefaultState() {
        this.setState(this.getDefaultState());
    }

    getClassName() {
        return this.__proto__.constructor.name;
    }

    getFqn() {
        throw new TypeError(this.getClassName() + ' store must implement getFqn() method!');
    }

    init() {
        this.setDefaultState();
        // We also have .Reset event, which will flush all currently held data
        this.onAction(this.getFqn() + '.Reset', (config = {emit: true}) => {
            this.setDefaultState();
            if (config.emit) {
                this.emitChange();
            }
        });
    }

    emitChange(delay = null) {
        setTimeout(() => {
            this.getState().then(data => {
                EventManager.emit(this.getFqn(), data);
            });
        }, delay);
    }

    /**
     * @returns {*}
     */
    $loadInitialData() {
        return Q([]);
    }

    onAction(action, callback) {
        var callbackFn = typeof callback == 'string' ? this[callback] : callback;
        EventManager.listen(action, callbackFn.bind(this), this.getFqn());
    }

    getState() {
        if (this.$loadingInitialData) {
            return this.$loader;
        }
        return Q(this.state);
    }

    setState(data) {
        // Unassign everything - bring store to default data (state)
        this.unsetState();

        // Assign response data to the original object reference
        _.assign(this.state, data);
    }

    unsetState() {
        Object.keys(this.state).map((key) => {
            delete this.state[key];
        });
    }

}

export default BaseStore;