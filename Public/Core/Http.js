function createQueryString(data) {
	if (!data) {
		return '';
	}
	return jQuery.param(data);
}

class Http {

	execute(url, method, data = null, options = {}) {

		var defaultConfig = {
			type: 'text'
		};

		var config = {};
		Object.assign(config, defaultConfig, options);

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
					reject(new Error(request.statusText));
				}
			};

			request.onerror = function () {
				reject(new Error('Unknown error occurred, probably a network error.'));
			};

			request.send(body);
		});
	}

	get(url, data, options = {}) {
		return this.execute(url, 'GET', data, options);
	}

	delete(url, options = {}) {
		return this.execute(url, 'DELETE', null, options);
	}

	head(url, options = {}) {
		return this.execute(url, 'HEAD', null, options);
	}

	post(url, data = {}, options = {}) {
		var postConfig = {
			headers: {
				"Content-type": "application/x-www-form-urlencoded"
			}
		};

		var config = {};
		Object.assign(config, postConfig, options);
		return this.execute(url, 'POST', data, config);
	}

	put(url, data = {}, options = {}) {
		return this.execute(url, 'PUT', data, options);
	}

	patch(url, data = {}, options = {}) {
		return this.execute(url, 'PATCH', data, options);
	}
}

export default new Http;