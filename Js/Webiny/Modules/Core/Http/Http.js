import HttpRequest from './Http/Request';
import HttpResponse from './Http/Response';

const requestInterceptors = [];
const responseInterceptors = [];
const defaultHeaders = {};

let pending = [];
let timeout = null;


function execute(http, options, aggregate = true) {
    if (!timeout && aggregate) {
        setTimeout(() => {
            sendAggregatedRequest(); // eslint-disable-line
        }, _.get(webinyConfig, 'Api.AggregationInterval', 100));
    }
    const headers = _.merge({}, defaultHeaders, options.headers || {});
    http.setHeaders(headers);
    http.setResponseType(options.responseType || 'json');

    if (options.progress) {
        http.setProgressHandler(options.progress);
    }

    let response;
    /* eslint-disable */
    for (let interceptor of requestInterceptors) {
        response = interceptor(http, options);
        if (response instanceof HttpResponse) {
            break;
        }
    }
    /* eslint-enable */

    if (!response) {
        if (!aggregate || !_.get(webinyConfig, 'Api.AggregateRequests', true) || http.getMethod() !== 'get') {
            response = http.send();
        } else {
            pending.push(http);
            http.promise = new Promise(resolve => {
                http.resolve = resolve;
            });

            if (pending.length >= _.get(webinyConfig, 'Api.MaxRequests', 30)) {
                clearTimeout(timeout);
                timeout = null;
                sendAggregatedRequest(); // eslint-disable-line
            }
            response = http;
        }
    } else {
        response = Promise.resolve(response);
    }

    return response.then(httpResponse => {
        responseInterceptors.forEach(interceptor => interceptor(httpResponse));
        return httpResponse;
    });
}

function sendAggregatedRequest() {
    if (!pending.length) {
        return;
    }
    const inProgress = _.cloneDeep(pending);
    // Reset pending requests
    pending = [];
    pending.length = 0;

    const body = inProgress.map(req => {
        return {
            url: req.getUrl(),
            query: req.getQuery()
        };
    });
    const request = new HttpRequest();
    request.setUrl(webinyApiPath + '/aggregate');
    request.setMethod('POST');
    request.setBody({requests: body});
    execute(request, {headers: {'X-Webiny-Api-Aggregate': true}}, false).then(response => {
        response.getData('data').map((res, index) => {
            const aggRes = new HttpResponse({data: res}, inProgress[index]);
            aggRes.setStatus(200);
            inProgress[index].resolve(aggRes);
        });
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
