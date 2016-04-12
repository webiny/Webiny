import Webiny from 'Webiny';
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
        this.params = config.params || {};
        this.body = {};
        if (_.indexOf(['PATCH', 'POST'], this.httpMethod) > -1) {
            this.body = config.body || {};
        }

        // Set additional parameters
        const params = ['_fields', '_page', '_perPage', '_sort', '_searchFields', '_searchQuery', '_searchOperator', '_fieldsDepth'];
        _.assign(this.params, _.pick(config, params));
    }

    setParams(params, merge = true) {
        if (merge) {
            this.params = _.assign({}, this.params, params);
        } else {
            this.params = params;
        }
        return this;
    }

    execute(httpMethod = null, method = null, body = null, params = null) {
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

        if (!params) {
            params = this.params;
        }

        //console.log('%c[Endpoint][Execute]: %c' + httpMethod + ':' + this.url + method, 'color: #666; font-weight: bold', 'color: blue; font-weight: bold');

        let request = null;
        switch (_.lowerCase(httpMethod)) {
            case 'get':
                request = this.get(method, params);
                break;
            case 'post':
                request = this.post(method, body, params);
                break;
            case 'patch':
                request = this.patch(method, body, params);
                break;
            case 'put':
                request = this.put(method, body, params);
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