import Webiny from 'Webiny';
import DataSource from './DataSource';

class Api extends DataSource {

    constructor(api, defaultParams = {}) {
        super();

        if (api instanceof Webiny.Api.Entity) {
            this.api = api;
        } else {
            this.api = new Webiny.Api.Entity(api);
        }

        this.defaultParams = defaultParams;
        this.lastRequestFingerprint = null;
        this.lastLoadedData = null;
    }

    setFields(fields) {
        this.api.setFields(fields);

        return this;
    }

    getData() {
        const params = _.assign({}, this.defaultParams, {
            _page: this.page,
            _perPage: this.perPage,
            _sort: Webiny.Router.sortersToString(this.sorters)
        }, this.filters);

        const requestFingerprint = JSON.stringify(params);
        if (this.lastRequestFingerprint === requestFingerprint) {
            return Q(this.lastLoadedData);
        }

        return this.api.crudList(params).then(apiResponse => {
            this.lastRequestFingerprint = requestFingerprint;
            this.lastLoadedData = apiResponse.getData();
            this.totalPages = this.lastLoadedData.meta.totalPages;
            return this.lastLoadedData;
        });
    }
}

export default Api;