import Webiny from 'Webiny';
import HttpResponse from './Response';

class HttpRequest {

    constructor() {
        this.url = '';
        this.method = 'get';
        this.headers = {};
        this.query = null;
        this.body = null;
        this.responseType = 'json';
        this.progress = (progressEvent) => {
        };
    }

    getUrl() {
        let url = this.url;
        if (!_.isEmpty(this.query)) {
            url += url.indexOf('?') > -1 ? '&' : '?';
            url += $.param(this.query);
        }
        return url;
    }

    setUrl(url) {
        this.url = url;
        return this;
    }

    getMethod() {
        return this.method;
    }

    setMethod(method) {
        this.method = method;
        return this;
    }

    getQuery() {
        return this.query;
    }

    /**
     * Set query parameters
     * @param query
     * @returns {Request}
     */
    setQuery(query) {
        this.query = query;
        return this;
    }

    getBody() {
        return this.body;
    }

    setBody(body) {
        this.body = body;
        return this;
    }

    getHeaders() {
        return this.headers;
    }

    setHeaders(headers) {
        this.headers = headers;
        return this;
    }

    addHeader(name, value) {
        this.headers[name] = value;
        return this;
    }

    setProgressHandler(handler) {
        this.progress = handler;
        return this;
    }

    getResponseType() {
        return this.responseType;
    }

    setResponseType(responseType) {
        this.responseType = responseType;
        return this;
    }

    getRequestObject() {
        var config = {
            url: this.getUrl(),
            method: this.getMethod(),
            headers: this.getHeaders(),
            data: JSON.stringify(this.getBody()),
            dataType: this.getResponseType(),
            contentType: 'application/json;charset=UTF-8',
            processData: false,
            xhr: () => {
                const xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener('progress', this.progress, false);

                return xhr;
            }
        };

        if (['put', 'post', 'patch'].indexOf(config.method) == -1) {
            delete config.data;
        }

        return config;
    }

    /**
     * Send promise and get response as {HttpResponse} class instance
     * @returns {Promise}
     */
    send() {
        this.promise = new Promise((resolve, reject) => {
            this.request = $.ajax(this.getRequestObject())
                .done((data, textStatus, jqXhr) => {
                    resolve(new HttpResponse(formatResponse(jqXhr)));
                })
                .fail(jqXhr => {
                    resolve(new HttpResponse(formatResponse(jqXhr)));
                });
        });

        return this;
    }

    then(fn) {
        this.promise = this.promise.then(fn);
        return this;
    }

    catch(fn) {
        this.promise = this.promise.catch(fn);
        return this;
    }

    abort() {
        this.request.abort();
    }
}

function formatResponse(jqXhr) {

    const headers = {};
    _.filter(jqXhr.getAllResponseHeaders().split("\n")).map(item => {
        const [key, value] = item.split(': ');
        headers[key] = value;
    });

    return {
        data: jqXhr.responseJSON,
        status: jqXhr.status,
        statusText: jqXhr.statusText,
        headers: headers
    };
}

export default HttpRequest;