import ApiResponse from '/Core/Api/ApiResponse';

function handleResponse(response){
	return new ApiResponse(response);
}

class ApiService {

	constructor(url) {
		this.url = url.toLowerCase();
	}

	crudList(filters, sorters, limit, page) {
		return Http.get(_apiUrl + this.url).then(handleResponse);
	}

	crudCreate(data) {
		return Http.post(_apiUrl + this.url, data).then(handleResponse);
	}

	crudDelete(id) {
		return Http.delete(_apiUrl + this.url + '/' + id).then(handleResponse);
	}

	crudReplace() {

	}

	crudGet(id) {
		return Http.get(_apiUrl + this.url + '/' + id).then(handleResponse);
	}

	crudUpdate(action, data, config = {}) {
		return Http.patch(_apiUrl + this.url + '/' + action, data, config).then(handleResponse);
	}

	get(action, data, config = {}) {
		return Http.get(_apiUrl + this.url + '/' + action, data, config).then(handleResponse);
	}

	delete(action, config = {}) {
		return Http.delete(_apiUrl + this.url + '/' + action, config).then(handleResponse);
	}

	head(action, config = {}) {
		return Http.head(_apiUrl + this.url + '/' + action, config).then(handleResponse);
	}

	post(action, data = {}, config = {}) {
		return Http.post(_apiUrl + this.url + '/' + action, data, config).then(handleResponse);
	}

	put(action, data = {}, config = {}) {
		return Http.put(_apiUrl + this.url + '/' + action, data, config).then(handleResponse);
	}

	patch(action, data = {}, config = {}) {
		return Http.patch(_apiUrl + this.url + '/' + action, data, config).then(handleResponse);
	}
}

export default ApiService;