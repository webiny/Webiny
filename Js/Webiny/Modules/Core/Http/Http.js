import HttpRequest from './Http/Request';
import HttpResponse from './Http/Response';

const requestInterceptors = [];
const responseInterceptors = [];
const defaultHeaders = {};

let pending = [];
let interval = null;

function sendAggregatedRequest() {
    if (!pending.length) {
        return;
    }
    const inProgress = _.cloneDeep(pending);
    // Reset pending requests
    pending = [];
    pending.length = 0;

    console.log('Sending aggregated requests', inProgress.length);
    const body = inProgress.map(req => {
        return {
            url: req.getUrl(),
            query: req.getQuery()
        };
    });
    const request = new HttpRequest();
    request.setUrl(webinyApiPath + '/api-aggregator');
    request.setMethod('POST');
    request.setBody({requests: body});
    request.send().then(response => {
        response.getData('data').map((res, index) => {
            const aggRes = new HttpResponse({data: res}, inProgress[index]);
            aggRes.setStatus(200);
            inProgress[index].resolve(aggRes);
        });
    });
}

function execute(http, options) {
    if (!interval) {
        setInterval(() => {
            sendAggregatedRequest();
        }, 100);
    }
    const headers = _.merge({}, defaultHeaders, options.headers || {});
    http.setHeaders(headers);
    http.setResponseType(options.responseType || 'json');

    if (options.progress) {
        http.setProgressHandler(options.progress);
    }

    let response;
    /*eslint-disable */
    for (let interceptor of requestInterceptors) {
        response = interceptor(http, options);
        if (response instanceof HttpResponse) {
            break;
        }
    }
    /*eslint-enble */

    if (!response) {
        if (!webinyConfig.Api.AggregateRequests || http.getMethod() !== 'get') {
            response = http.send();
        } else {
            pending.push(http);
            http.promise = new Promise(resolve => {
                http.resolve = resolve;
            });

            if (pending.length >= webinyConfig.Api.MaxRequests) {
                clearInterval(interval);
                interval = null;
                sendAggregatedRequest();
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
