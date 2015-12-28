import ApiStore from './Api';
import EntityApiService from './../Api/EntityService';

/**
 * Base class for all entity data stores
 */
class ListStore extends ApiStore {

    getDefaultState() {
        return {
            data: [],
            meta: {}
        };
    }

    init() {
        this.registerCallbacks(['List']);
        super.init();
    }

    crudList(params, config = {emit: true}) {

        return this.api.crudList(params).then(apiResponse => {
            if (!apiResponse.isError()) {

                this.setState(apiResponse.getData());

                if (config.emit) {
                    this.emitChange();
                }
            }
            return apiResponse;
        });
    }

	getState(loadIfEmpty = false) {
		if(loadIfEmpty && _.isEqual(this.state, this.getDefaultState())){
			return this.crudList().then(apiResponse => {
				return super.getState();
			});
		}
		return super.getState();
	}

    /**
     * Because of the different initial data (state) structure, we need to define custom assign/unassign methods
     * @param data
     */
    setState(data) {

        this.unsetState();

        // Assign response data to the original object reference
        data.data.forEach(item => {
            this.state.data.push(item);
        });
        _.assign(this.state.meta, data.meta);
    }

    /**
     * We must clear the data array (list) and all meta data
     */
    unsetState() {
        this.state.data.length = 0;

        Object.keys(this.state.meta).map((key) => {
            delete this.state.meta[key];
        });
    }
}


export default ListStore;