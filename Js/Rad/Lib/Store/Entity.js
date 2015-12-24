import ApiStore from './Api';
import EntityApiService from './../Api/EntityService';

/**
 * Base class for all entity data stores
 */
class EntityStore extends ApiStore {

    init() {
        this.registerCallbacks(['Create', 'Delete', 'Update', 'Restore', 'Get']);
        super.init();
    }

    crudGet(id, params = {}, config = {emit: true}) {
        return this.getApi().crudGet(id, params).then(apiResponse => {
            return this.handleApiResponse(apiResponse, config);
        });
    }

    crudCreate(data, params = {}, config = {emit: true}) {
        return this.getApi().crudCreate(data, params).then(apiResponse => {
            return this.handleApiResponse(apiResponse, config);
        });
    }

    crudUpdate(data, params =  {}, config = {emit: true}) {
        return this.getApi().crudUpdate(data.id, data, params).then(apiResponse => {
            return this.handleApiResponse(apiResponse, config);
        });
    }

    crudRestore(id, config = {emit: true}) {
        return this.getApi().crudRestore(_.isObject(id) ? id.id : id).then(apiResponse => {
            return this.handleApiResponse(apiResponse, config);
        });
    }

    crudDelete(id, config = {emit: true}) {
        return this.getApi().crudDelete(_.isObject(id) ? id.id : id).then(apiResponse => {
            if (!apiResponse.isError()) {
                this.unsetState();
                if (config.emit) {
                    this.emitChange();
                }
            }
            return apiResponse;
        });
    }

    handleApiResponse(apiResponse, config) {

        // Do whatever you wanna do before default handling of store
        if (!apiResponse.isError()) {
            this.setState(apiResponse.getData());
            if (config.emit) {
                this.emitChange();
            }
        }
        return apiResponse;
    }

}


export default EntityStore;