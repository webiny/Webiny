class ApiResponse {

	constructor(httpResponse) {
		this.originalResponse = httpResponse;
		this.responseBody = httpResponse;
	}

	isError(){
		return 'errorReport' in this.responseBody;
	}

	getErrorReport(){
		if(this.isError()){
			return this.responseBody.errorReport;
		}
		return null;
	}

	getData(){
		if('data' in this.responseBody && 'data' in this.responseBody.data){
			return this.responseBody.data.data;
		}
		return null;
	}
}

export default ApiResponse;