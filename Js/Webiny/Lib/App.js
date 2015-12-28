class App {

	constructor(name){
		this.name = name;
		this.modules = [];
		this.stores = {};
	}

	addModules(){
		_.forEach(arguments, module => this.addModule(module));
		return this;
	}

	addModule(name){
		this.modules.push(name);
		return this;
	}

	setInitialElement(element){
		this.element = element;
		return this;
	}

	run(mountPoint){
		Webiny.Console.groupCollapsed('App bootstrap');
		var promises = this.modules.map(x => System.import('Modules/' + x + '/Module'));
		this.modules = [];
        Promise.all(promises).then(modules => {
			modules.forEach(m => {
				var module = new m.default(this);
				module.run();
                this.modules.push(module);
			});
            Webiny.Console.groupEnd();

			ReactDOM.render(this.element, mountPoint);
        });
	}
}

export default App;