class WebinyApp {

	constructor() {
		this.name = 'Webiny';
		this.modules = [];

		window.Webiny = {
			Apps: {},
			Ui: {}
		};
	}

	addModules(modules) {
		modules.map(name => {
			this.modules.push(name);
		});
		return this;
	}

	run() {
		this.modules.splice(this.modules.indexOf("Core"), 1);
		this.modules.unshift("Core");
		let imported = [];
		let queue = Q();

		this.modules.map(name => {
			queue = queue.then(() => {
				return WebinyBootstrap.import('Modules/' + name + '/Module').then(m => {
					imported.push(m.default);
					let module = new m.default(this);
					module.run();
				});
			});
		});

		this.modules = imported;

		return queue;
	}
}

export default new WebinyApp;