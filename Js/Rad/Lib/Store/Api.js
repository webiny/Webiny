import BaseStore from './Base';
import EntityApiService from './../Api/EntityService';

/**
 * Base class for all entity data stores
 */
class ApiStore extends BaseStore {

    constructor(fqn = null, service = null, defaultState = null) {
        super();

        this.fqn = fqn;

        service = service || this.getService();

        if (defaultState) {
            this.getDefaultState = function() {return defaultState };
            this.setDefaultState();
        }

        if (!service) {
            throw Error(`Entity store must have a service to work with!\nMake sure you define a service in getService() method!`);
        }
        if (service instanceof EntityApiService) {
            this.api = service;
        } else {
            this.api = new EntityApiService(service);
        }
    }

	getFqn(){
        return this.fqn;
	}

    /**
     * Create system callbacks to automatically call appropriate crud operation when Action is triggered
     */
    registerCallbacks(actions) {

        var fqn = this.getFqn();

        // Remove trailing word "Store" in FQN
        var hasStoreInEnd = fqn.substring(fqn.length - 5, fqn.length) == 'Store';
        if (hasStoreInEnd) {
            fqn = fqn.substring(0, fqn.length - 5)
        }

        actions.forEach(action => {

            var actionName = fqn + '.' + action;
            var callbackName = `on${action}`;

            this[callbackName] = (data) => {
				if(!_.isArray(data)){
					data = [data];
				}
                return this['crud' + action](...data);
            };

            this.onAction(actionName, this[callbackName]);
        });

    }

    getService() {
        return null;
    }

    getApi() {
        return this.api;
    }

    setApi(api) {
        this.api = api;
        return this;
    }

    setApiUrl(url) {
        this.api.setUrl(url);
        return this;
    }

}

export default ApiStore;