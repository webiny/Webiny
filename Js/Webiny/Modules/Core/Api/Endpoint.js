import Base from './Base';

class Endpoint extends Base {

    constructor(baseUrl, config = {}) {
        super(baseUrl);
        // URL is a relative part of request, containing entity/service action
        this.url = config.url || '/';
        // GET, POST, PATCH, PUT, DELETE, HEAD
        this.httpMethod = config.httpMethod || 'GET';
        // initial query params that will be sent with every request until they is changed by component, using setQuery() method or via request arguments
        this.query = config.query || {};
        // defaultQuery are query params that will ALWAYS be appended to all requests using this Endpoint
        // NOTE: these can not be changed after initialization
        this.defaultQuery = config.defaultQuery || {};
        // initial body payload that will be sent with every request until it is changed by component, using setBody() method or via request arguments
        this.body = config.body || {};
        // defaultBody are body params that will ALWAYS be appended to all requests containing body using this Endpoint
        // NOTE: these can not be changed after initialization
        this.defaultBody = config.defaultBody || {};
        // config contains optional request parameters, like `progress` handler
        this.config = {};

        if (_.indexOf(['PATCH', 'POST'], this.httpMethod) === -1) {
            this.body = null;
        }
    }

    setUrl(url) {
        this.url = url;
        return this;
    }

    setHttpMethod(httpMethod) {
        this.httpMethod = httpMethod;
        return this;
    }

    setBody(body) {
        this.body = body;
        return this;
    }

    setQuery(query) {
        this.query = query;
        return this;
    }

    setConfig(config) {
        this.config = config;
        return this;
    }

    getRequestQuery(query = null) {
        return _.merge({}, this.defaultQuery, query || this.query);
    }

    getRequestBody(body = null) {
        return _.merge({}, this.defaultBody, body || this.body);
    }

    get(url = '', query = {}, config = {}) {
        return super.get(url, this.getRequestQuery(query), config);
    }

    delete(url = '', config = {}) {
        return super.delete(url, config);
    }

    head(url = '', config = {}) {
        return super.head(url, config);
    }

    post(url = '', body = {}, query = {}, config = {}) {
        return super.post(url, this.getRequestBody(body), this.getRequestQuery(query), config);
    }

    patch(url = '', body = {}, query = {}, config = {}) {
        return super.patch(url, this.getRequestBody(body), this.getRequestQuery(query), config);
    }

    put(url = '', body = {}, query = {}, config = {}) {
        return super.put(url, this.getRequestBody(body), this.getRequestQuery(query), config);
    }

    execute(httpMethod = null, url = null, body = null, query = null, config = {}) {
        if (!url) {
            url = this.url || '/';
        }

        url = url.replace(/\/\/+/g, '/');

        if (!httpMethod) {
            httpMethod = this.httpMethod;
        }

        let request = null;
        switch (_.lowerCase(httpMethod)) {
            case 'get':
                request = this.get(url, query, config);
                break;
            case 'post':
                request = this.post(url, body, query, config);
                break;
            case 'patch':
                request = this.patch(url, body, query, config);
                break;
            case 'put':
                request = this.put(url, body, query, config);
                break;
            case 'delete':
                request = this.delete(url, config);
                break;
            case 'head':
                request = this.head(url, config);
                break;
            default:
                throw new Error('Unable to execute url: ' + httpMethod + ' ' + url);
        }

        return request;
    }
}

export default Endpoint;