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
            _sort: Webiny.Router.sortersToString(this.sorters),
            _searchFields: this.searchFields,
            _searchQuery: this.searchQuery,
            _searchOperator: this.searchOperator
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

    update(id, attributes) {
        this.lastRequestFingerprint = null;
        return this.api.crudUpdate(id, attributes);
    }

    delete(id) {
        this.lastRequestFingerprint = null;
        return this.api.crudDelete(id);
    }

    execute(httpMethod, method, body, params) {
        switch (_.lowerCase(httpMethod)) {
            case 'get':
                return this.api.get(method, params);
            case 'post':
                return this.api.post(method, body, params);
            case 'patch':
                return this.api.patch(method, body, params);
            case 'put':
                return this.api.put(method, body, params);
            case 'delete':
                return this.api.delete(method);
            case 'head':
                return this.api.head(method);
            default:
                throw new Error('Unable to execute method: ' + httpMethod + ' ' + method);
        }
    }
}

export default Api;