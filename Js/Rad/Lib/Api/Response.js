class ApiResponse {

	/**
	 * @param {HttpResponse} httpResponse
	 */
	constructor(httpResponse) {
		this.response = httpResponse;
		this.data = httpResponse.getData();
	}

	isError(){
        return 'errorReport' in this.data;
	}

    isSuccess() {
        return !this.isError();
    }

	getErrorReport(key = false){
		if(this.isError()){
			return key ? _.get(this.data.errorReport, key) : this.data.errorReport;
		}
		return null;
	}

	getFirstErrorMessage(){
		return this.getErrorReport().errors[0].message;
	}

	getData(key){
		if(this.data && 'data' in this.data){
			return key ? _.get(this.data.data, key) : this.data.data;
		}
		return null;
	}

	getMeta(key) {
		if(this.data && 'meta' in this.data){
			return key ? _.get(this.data.meta, key) : this.data.meta;
		}
		return null;
	}
}

export default ApiResponse;