import Webiny from 'Webiny';
import WebinyModule from './Core/Module';
import App from './Core/App';
import Component from './Core/Component';
import FormComponent from './Core/FormComponent';
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
import Entity from './Api/Entity';
import Settings from './Ui/Settings';
import Menu from './Ui/Menu';
import Hide from './Ui/Hide';
import Value from './Ui/Value';

class Module extends WebinyModule {

	constructor(app) {
		super(app);

		_.merge(Webiny, {
			App,
			Module: WebinyModule,
            Modules: {},
			Ui: {
				Component,
                Components: {
                    Hide,
                    Value
                },
				Dispatcher: UiDispatcher,
                FormComponent,
                Menu,
                Settings,
				View,
                Views: {}
			},
			Injector,
			Model,
			Router,
			Route,
			Dispatcher,
			Tools,
			Console: Console.init(),
            Cookies, // from js-cookies
			Http,
			Api: {
				Service,
				Entity
			}
		});
	}
}

export default Module;
