class App {

	constructor(name) {
		this.name = name;
		this.modules = [];
	}

	addModules(modules) {
		modules.map(name => {
			this.modules.push(name);
		});
		return this;
	}

	setInitialElement(element) {
		this.element = element;
		return this;
	}

	run(mountPoint) {
		Webiny.Console.groupCollapsed('App bootstrap');
		let promises = this.modules.map(x => WebinyBootstrap.import('Modules/' + x + '/Module'));
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