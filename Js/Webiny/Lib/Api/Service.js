import ApiResponse from './Response';
import Registry from './../Registry';
import Http from './../Http/Http';

function handleResponse(response) {
	return new ApiResponse(response);
}

function sanitize(string) {
	return _.trimLeft(string, '/ ');
}

class Service {

	constructor(url) {
		this.url = url.toLowerCase();
	}

    setUrl(url) {
        this.url = url;
    }

	get(action = '', data = {}, config = {}) {
		return Http.get(_apiUrl + this.url + '/' + sanitize(action), data, config).then(handleResponse).catch(handleResponse);
	}

	delete(action = '', config = {}) {
        return Http.delete(_apiUrl + this.url + '/' + sanitize(action), config).then(handleResponse).catch(handleResponse);
	}

	head(action = '', config = {}) {
		return Http.head(_apiUrl + this.url + '/' + sanitize(action), config).then(handleResponse).catch(handleResponse);
	}

	post(action = '', data = {}, params = {}, config = {}) {
        return Http.post(_apiUrl + this.url + '/' + sanitize(action), data, params, config).then(handleResponse).catch(handleResponse);
	}

	put(action = '', data = {}, params = {}, config = {}) {
		return Http.put(_apiUrl + this.url + '/' + sanitize(action), data, params, config).then(handleResponse).catch(handleResponse);
	}

	patch(action = '', data = {}, params = {}, config = {}) {
        return Http.patch(_apiUrl + this.url + '/' + sanitize(action), data, params, config).then(handleResponse).catch(handleResponse);
	}
}

export default Service;