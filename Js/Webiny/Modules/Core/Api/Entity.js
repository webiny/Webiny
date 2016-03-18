import ApiService from './Service';

class EntityApiService extends ApiService {

    constructor(url) {
        super('/entities' + url);
    }

    crudList(params) {
        return this.get('/', params);
    }

    crudGet(id, params) {
        return this.get(id, params);
    }

    crudCreate(data, params) {
        return this.post('/', data, params);
    }

    crudUpdate(id, data, params = {}) {
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
