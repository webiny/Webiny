class ApiService {

	constructor(url) {
		this.url = url;
	}

	crudList(filters, sorters, limit, page){
		return Http.get(_apiUrl + this.url);
	}

	crudCreate(data){
		return Http.post(_apiUrl + this.url, data);
	}

	crudDelete(id){
		return Http.delete(_apiUrl + this.url+'/'+id);
	}

	crudReplace(){

	}

	crudGet(){

	}

	crudUpdate(){

	}
}

export default ApiService;