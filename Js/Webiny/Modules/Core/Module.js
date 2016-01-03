import WebinyModule from './Core/Module';

import App from './Core/App';
import Component from './Core/Component';
import Injector from './Core/Injector';
import Model from './Core/Model';
import View from './Core/View';
import Dispatcher from './Core/Dispatcher';
import UiDispatcher from './Core/UiDispatcher';
import Router from './Router/Router';
import Route from './Router/Route';
import Http from './Http/Http';
import Tools from './Tools';
import Console from './Console';
import Service from './Api/Service';
import EntityService from './Api/EntityService';

class Module extends WebinyModule {

	constructor(app) {
		super(app);

		this.name = 'Core';

		_.assign(window.Webiny, {
			App,
			Module: WebinyModule,
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
		});
	}
}

export default Module;
