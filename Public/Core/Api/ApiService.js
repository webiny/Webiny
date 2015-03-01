class ApiService {

	constructor(url) {
		this.url = url.toLowerCase();
	}

	crudList(filters, sorters, limit, page) {
		return Http.get(_apiUrl + this.url);
	}

	crudCreate(data) {
		return Http.post(_apiUrl + this.url, data);
	}

	crudDelete(id) {
		return Http.delete(_apiUrl + this.url + '/' + id);
	}

	crudReplace() {

	}

	crudGet(id) {
		return Http.get(_apiUrl + this.url + '/' + id);
	}

	crudUpdate(action, data, config = {}) {
		return Http.patch(_apiUrl + this.url + '/' + action, data, config);
	}

	get(action, data, config = {}) {
		// TODO: build URL-like GET string /param1/param2/
		return Http.get(_apiUrl + this.url + '/' + action, {}, config);
	}

	delete(action, data = {}, config = {}) {
		// TODO: build URL-like DELETE string /param1/param2/
		return Http.delete(_apiUrl + this.url + '/' + action, config);
	}

	head(action, config = {}) {
		return Http.head(_apiUrl + this.url + '/' + action, config);
	}

	post(action, data = {}, config = {}) {
		return Http.post(_apiUrl + this.url + '/' + action, data, config);
	}

	put(action, data = {}, config = {}) {
		return Http.put(_apiUrl + this.url + '/' + action, {}, config);
	}

	patch(action, data = {}, config = {}) {
		return Http.patch(_apiUrl + this.url + '/' + action, {}, config);
	}
}

export default ApiService;