class HttpResponse {

	constructor(response){
		this.data = response.data;
		this.status = response.status;
		this.statusText = response.statusText;
		this.headers = response.headers;
	}

	getData(){
		return this.data;
	}

	setData(data){
		this.data = data;
		return this;
	}

	getStatus(){
		return this.status;
	}

	setStatus(status){
		this.status = status;
		return this;
	}

	getStatusText(){
		return this.statusText;
	}

	setStatusText(statusText){
		this.statusText = statusText;
		return this;
	}

	getHeaders(){
		return this.headers;
	}
}

export default HttpResponse;