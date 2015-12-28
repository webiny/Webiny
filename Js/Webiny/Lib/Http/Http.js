import HttpRequest from './Http/Request';
import HttpResponse from './Http/Response';

var requestInterceptors = [];
var responseInterceptors = [];
var defaultHeaders = {};

function execute(http, options) {
    var headers = _.merge({}, defaultHeaders, options.headers || {});
	http.setHeaders(headers);
	http.setResponseType(options.responseType || 'json');

	if(options.progress){
		http.setProgressHandler(options.progress);
	}

	var response = null;
	for(var i in requestInterceptors){
		var interceptor = requestInterceptors[i];
		response = interceptor(http);
		if(response instanceof HttpResponse){
			break;
		}
	}
	response = response ? Q.when(response) : http.send();

	return response.then(httpResponse => {
		responseInterceptors.forEach(interceptor => interceptor(httpResponse));
		return httpResponse;
	});
}

var Http = {
	Request: HttpRequest,
	Response: HttpResponse,

	/**
	 * @options can contain {headers: {}, responseType: 'json'}
	 */
	get(url, params = {}, options = {}) {
		var http = new HttpRequest();
		http.setUrl(url).setMethod('get').setParams(params);
		return execute(http, options);
	},

	delete(url, options = {}) {
		var http = new HttpRequest();
		http.setUrl(url).setMethod('delete');
		return execute(http, options);
	},

	head(url, options = {}) {
		var http = new HttpRequest();
		http.setUrl(url).setMethod('head');
		return execute(http, options);
	},

	post(url, data = {}, params = {}, options = {}) {
		var http = new HttpRequest();
		http.setUrl(url).setMethod('post').setData(data).setParams(params);
		return execute(http, options);
	},

	put(url, data = {}, params = {}, options = {}) {
		var http = new HttpRequest();
		http.setUrl(url).setMethod('put').setData(data).setParams(params);
		return execute(http, options);
	},

	patch(url, data = {}, params = {}, options = {}) {
		var http = new HttpRequest();
		http.setUrl(url).setMethod('patch').setData(data).setParams(params);
		return execute(http, options);
	},

	addRequestInterceptor(interceptor) {
		requestInterceptors.push(interceptor);
		return this;
	},

	addResponseInterceptor(interceptor) {
		responseInterceptors.push(interceptor);
		return this;
	}
};

export default Http;