class Tools {

	createUID(){
		var delim = '-';

		function S4() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		}

		return S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4();
	}

	createPromise(data){
		return Q.when(data).then((data) => {
			return data;
		});
	}
}

export default new Tools;