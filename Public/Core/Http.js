function createQueryString(data) {
	if (!data) {
		return '';
	}
	return jQuery.param(data);
}

function execute(url, method, data = null, config = {}) {

	var defaultConfig = {
		type: 'text'
	};

	Object.assign(config, defaultConfig, config);

	return new Promise(function (resolve, reject) {
		// Create request object
		var request = new XMLHttpRequest();

		// Handle body/parameters
		var body = null;
		var params = createQueryString(data);
		if (method == 'GET' && data != null) {
			url += url.indexOf('?') > 0 ? '&' + params : '?' + params;
		}

		if(method != 'GET' && method != 'HEAD' && data){
			body = params;
		}

		// Open request
		request.open(method, url, true);

		// Add headers if any...
		if (config.hasOwnProperty('headers')) {
			Object.keys(config.headers).forEach(function (header) {
				request.setRequestHeader(header, config.headers[header]);
			});
		}

		// Set the appropriate response type
		if (config.type == 'blob') {
			request.responseType = 'blob';
		} else {
			request.responseType = '';
		}

		// Handle response
		request.onload = function () {
			if (request.status == 200) {
				if (request.getResponseHeader("Content-Type") == 'application/json') {
					resolve(JSON.parse(request.response));
				} else {
					resolve(request.response);
				}
			} else {
				reject(Error(request.statusText));
			}
		};

		request.onerror = function () {
			reject(Error('Unknown error occurred, probably a network error.'));
		};

		request.send(body);
	});
}

class Http {

	get(url, data, config = {}) {
		return execute(url, 'GET', data, config);
	}

	delete(url, data = {}, config = {}) {
		return execute(url, 'DELETE', data, config);
	}

	head(url, config = {}) {
		return execute(url, 'HEAD', null, config);
	}

	post(url, data = {}, config = {}) {
		var postConfig = {
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			}
		};

		Object.assign(config, postConfig, config);
		return execute(url, 'POST', data, config);
	}

	put(url, data = {}, config = {}) {
		return execute(url, 'PUT', data, config);
	}

	patch(url, data = {}, config = {}) {
		return execute(url, 'PATCH', data, config);
	}
}

export default new Http;