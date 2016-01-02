import App from './Lib/Core/App';
import Module from './Lib/Core/Module';
import Component from './Lib/Core/Component';
import Injector from './Lib/Core/Injector';
import Model from './Lib/Core/Model';
import View from './Lib/Core/View';
import Dispatcher from './Lib/Core/Dispatcher';
import UiDispatcher from './Lib/Core/UiDispatcher';
import Router from './Lib/Router/Router';
import Route from './Lib/Router/Route';
import Http from './Lib/Http/Http';
import Tools from './Lib/Tools';
import Console from './Lib/Console';
import Service from './Lib/Api/Service';
import EntityService from './Lib/Api/EntityService';

class WebinyApp {

	constructor() {
		this.name = 'Webiny';
		this.modules = [];

		window.Webiny = {
			Apps: {},
			App,
			Module,
			Ui: {
				Component,
				Dispatcher: UiDispatcher,
				View
			},
			Injector,
			Model,
			Router,
			Route,
			Dispatcher,
			Tools,
			Console: Console.init(),
			Http,
			Api: {
				Service,
				EntityService
			}
		};
	}

	addModules(modules) {
		modules.map(name => {
			this.modules.push(name);
		});
		return this;
	}

	run() {
		let promises = this.modules.map(x => WebinyBootstrap.import('Modules/' + x + '/Module'));
		this.modules = [];
		Promise.all(promises).then(modules => {
			modules.forEach(m => {
				var module = new m.default(this);
				module.run();
				this.modules.push(module);
			});
		});
	}
}

export default new WebinyApp;