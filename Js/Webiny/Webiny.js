import App from './Lib/App';
import Module from './Lib/Module';
import Component from './Lib/Component';
import Injector from './Lib/Injector';
import Model from './Lib/Model';
import View from './Lib/View';
import Dispatcher from './Lib/Dispatcher';
import UiDispatcher from './Lib/UiDispatcher';
import Router from './Lib/Router/Router';
import Route from './Lib/Router/Route';
import Components from './Components/Components';
import Views from './Views/Views';
import Http from './Lib/Http/Http';
import Tools from './Lib/Tools';
import Console from './Lib/Console';
import Service from './Lib/Api/Service';
import EntityService from './Lib/Api/EntityService';

let Webiny = {
	Apps: {},
	App,
	Module,
	Ui: {
		Component,
		Components,
		Dispatcher: UiDispatcher,
		View,
		Views
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

export default Webiny;