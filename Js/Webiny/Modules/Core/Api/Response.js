class ApiResponse {

    /**
     * @param {HttpResponse} httpResponse
     */
    constructor(httpResponse) {
        this.response = httpResponse;
        this.data = httpResponse.getData();
    }

    isError() {
        return 'code' in this.data;
    }

    isSuccess() {
        return !this.isError();
    }

    getError() {
        return this.data.message;
    }

    getData(key) {
        if (this.data && 'data' in this.data) {
            return key ? _.get(this.data.data, key) : this.data.data;
        }
        return null;
    }

    getCode(){
        if (this.data && 'code' in this.data) {
            return this.data.code;
        }
        return null;
    }

    getMeta(key) {
        if (this.data && 'meta' in this.data) {
            return key ? _.get(this.data.meta, key) : this.data.meta;
        }
        return null;
    }
}

export default ApiResponse;
