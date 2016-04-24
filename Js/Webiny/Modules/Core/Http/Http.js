import HttpRequest from './Http/Request';
import HttpResponse from './Http/Response';

const requestInterceptors = [];
const responseInterceptors = [];
const defaultHeaders = {};

function execute(http, options) {
    const headers = _.merge({}, defaultHeaders, options.headers || {});
    http.setHeaders(headers);
    http.setResponseType(options.responseType || 'json');

    if (options.progress) {
        http.setProgressHandler(options.progress);
    }

    let response;
    /*eslint-disable */
    for (let interceptor of requestInterceptors) {
        response = interceptor(http);
        if (response instanceof HttpResponse) {
            break;
        }
    }
    /*eslint-enble */

    response = response ? Q.when(response) : http.send();

    return response.then(httpResponse => {
        responseInterceptors.forEach(interceptor => interceptor(httpResponse));
        return httpResponse;
    });
}

const Http = {
    Request: HttpRequest,
    Response: HttpResponse,

    /**
     * @options can contain {headers: {}, responseType: 'json'}
     */
    get(url, params = {}, options = {}) {
        const http = new HttpRequest();
        http.setUrl(url).setMethod('get').setQuery(params);
        return execute(http, options);
    },

    delete(url, options = {}) {
        const http = new HttpRequest();
        http.setUrl(url).setMethod('delete');
        return execute(http, options);
    },

    head(url, options = {}) {
        const http = new HttpRequest();
        http.setUrl(url).setMethod('head');
        return execute(http, options);
    },

    post(url, data = {}, params = {}, options = {}) {
        const http = new HttpRequest();
        http.setUrl(url).setMethod('post').setBody(data).setQuery(params);
        return execute(http, options);
    },

    put(url, data = {}, params = {}, options = {}) {
        const http = new HttpRequest();
        http.setUrl(url).setMethod('put').setBody(data).setQuery(params);
        return execute(http, options);
    },

    patch(url, data = {}, params = {}, options = {}) {
        const http = new HttpRequest();
        http.setUrl(url).setMethod('patch').setBody(data).setQuery(params);
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
