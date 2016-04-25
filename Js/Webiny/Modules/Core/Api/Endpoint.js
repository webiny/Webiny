import Base from './Base';

// TODO: add TTL to cached results
/*
 const lastUsedSource = {};
 const lastResult = {};

 function hash(string) {
 let hash = 0, i, chr, len;
 if (string.length === 0) return hash;
 for (i = 0, len = string.length; i < len; i++) {
 chr = string.charCodeAt(i);
 hash = ((hash << 5) - hash) + chr;
 hash |= 0; // Convert to 32bit integer
 }
 return hash;
 }
 */

class Endpoint extends Base {

    constructor(url, config = {}) {
        super(url);
        this.method = config.method || '/';
        this.httpMethod = config.httpMethod || 'GET';
        this.query = config.query || {};
        this.body = {};
        if (_.indexOf(['PATCH', 'POST'], this.httpMethod) > -1) {
            this.body = config.body || {};
        }

        // Set additional parameters
        const query = ['_fields', '_page', '_perPage', '_sort', '_searchFields', '_searchQuery', '_searchOperator', '_fieldsDepth'];
        _.assign(this.query, _.pick(config, query));
    }

    setMethod(method) {
        this.method = method;
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

    setQuery(query, merge = true) {
        if (merge) {
            this.query = _.assign({}, this.query, query);
        } else {
            this.query = query;
        }
        return this;
    }

    execute(httpMethod = null, method = null, body = null, query = null) {
        if (!method) {
            method = this.method || '/';
        }

        method = method.replace(/\/\/+/g, '/');

        if (!httpMethod) {
            httpMethod = this.httpMethod;
        }

        if (!body) {
            body = this.body;
        }

        if (!query) {
            query = this.query;
        }

        let request = null;
        switch (_.lowerCase(httpMethod)) {
            case 'get':
                request = this.get(method, query);
                break;
            case 'post':
                request = this.post(method, body, query);
                break;
            case 'patch':
                request = this.patch(method, body, query);
                break;
            case 'put':
                request = this.put(method, body, query);
                break;
            case 'delete':
                request = this.delete(method);
                break;
            case 'head':
                request = this.head(method);
                break;
            default:
                throw new Error('Unable to execute method: ' + httpMethod + ' ' + method);
        }

        return request;
    }
}

export default Endpoint;