import BaseService from './BaseService';

class EntityApiService extends BaseService {

    constructor(url, fields = null) {
        super('/entities/' + _.trimStart(url, '/'));
        this.fields = fields || '';
    }

    crudList(params) {
        params = this.prepareParams(params);
        return this.get('/', params);
    }

    crudGet(id, params) {
        params = this.prepareParams(params);
        return this.get(id, params);
    }

    crudCreate(data, params) {
        params = this.prepareParams(params);
        return this.post('/', data, params);
    }

    crudUpdate(id, data, params = {}) {
        params = this.prepareParams(params);
        return this.patch(id, data, params);
    }

    crudDelete(id) {
        return this.delete(id);
    }

    crudRestore(id) {
        return this.post('/restore/' + id);
    }

    setFields(fields) {
        this.fields = fields;

        return this;
    }

    prepareParams(params) {
        params = params || {};
        if (!params._fields) {
            params._fields = this.fields;
        }
        return params;
    }
}

export default EntityApiService;
