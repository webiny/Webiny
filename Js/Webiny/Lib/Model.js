class Model extends Baobab {

	select(...args){
		if(_.isString(args[0])){
			args[0] = args[0].split('.');
		}
		return super.select(...args);
	}
}

export default new Model;