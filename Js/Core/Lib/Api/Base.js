import Webiny from 'webiny';
import _ from 'lodash';
import ApiResponse from './Response';
import Http from './../Http/Http';

function handleResponse(response) {
    return new ApiResponse(response);
}

function sanitize(url) {
    url = _.trimStart(url, '/ ');
    return url.length ? '/' + url : '';
}

class Base {

    constructor(url) {
        this.baseUrl = url.toLowerCase();
    }

    get(url = '', body = {}, config = {}) {
        return Http.get(Webiny.Config.ApiPath + this.baseUrl + sanitize(url), body, config).then(handleResponse).catch(handleResponse);
    }

    delete(url = '', config = {}) {
        return Http.delete(Webiny.Config.ApiPath + this.baseUrl + sanitize(url), config).then(handleResponse).catch(handleResponse);
    }

    head(url = '', config = {}) {
        return Http.head(Webiny.Config.ApiPath + this.baseUrl + sanitize(url), config).then(handleResponse).catch(handleResponse);
    }

    post(url = '', body = {}, query = {}, config = {}) {
        return Http.post(Webiny.Config.ApiPath + this.baseUrl + sanitize(url), body, query, config).then(handleResponse).catch(handleResponse);
    }

    put(url = '', body = {}, query = {}, config = {}) {
        return Http.put(Webiny.Config.ApiPath + this.baseUrl + sanitize(url), body, query, config).then(handleResponse).catch(handleResponse);
    }

    patch(url = '', body = {}, query = {}, config = {}) {
        return Http.patch(Webiny.Config.ApiPath + this.baseUrl + sanitize(url), body, query, config).then(handleResponse).catch(handleResponse);
    }
}

export default Base;
