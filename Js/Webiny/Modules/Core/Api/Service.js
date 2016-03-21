import BaseService from './BaseService';

class Service extends BaseService {

    constructor(url) {
        super('/services/' + _.trimStart(url.toLowerCase(), '/'));
    }
}

export default Service;
