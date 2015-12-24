import ApiService from './Service';

function prepareParams(params) {

    var paramsMap = {
        page: '_page',
        perPage: '_perPage',
        fields: '_fields',
        fieldsDepth: '_fieldsDepth',
        sort: '_sort',
		searchFields: '_searchFields',
		searchQuery: '_searchQuery',
		searchOperator: '_searchOperator',
        limit: '_limit'
    };

    _.forEach(params, (value, key) => {
        if (paramsMap[key]) {
            params[paramsMap[key]] = value;
            delete params[key];
        }
    });
}

class EntityApiService extends ApiService {

    crudList(params) {
        prepareParams(params);
        return this.get('/', params);
    }

    crudGet(id, params) {
        prepareParams(params);
        return this.get(id, params);
    }

    crudCreate(data, params) {
        prepareParams(params);
        return this.post('/', data, params);
    }

    crudUpdate(id, data, params = {}) {
        prepareParams(params);
        return this.patch(id, data, params);
    }

    crudDelete(id) {
        return this.delete(id);
    }

    crudRestore(id) {
        return this.post('/restore/' + id);
    }
}

export default EntityApiService;