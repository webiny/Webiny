import Webiny from 'Webiny';
import WebinyModule from './Core/Module';
import App from './Core/App';
import Component from './Core/Component';
import FormComponent from './Core/FormComponent';
import ModalComponent from './Core/ModalComponent';
import ApiComponent from './Core/ApiComponent';
import Injector from './Core/Injector';
import Model from './Core/Model';
import View from './Core/View';
import Dispatcher from './Core/Dispatcher';
import UiDispatcher from './Core/UiDispatcher';
import Router from './Router/Router';
import Route from './Router/Route';
import Http from './Http/Http';
import Tools from './Tools';
import i18n from './i18n/i18n';
import Endpoint from './Api/Endpoint';
import Settings from './Ui/Settings';
import Menu from './Ui/Menu';
import Hide from './Ui/Hide';
import Show from './Ui/Show';
import Value from './Ui/Value';


class Module extends WebinyModule {

	constructor(app) {
		super(app);

		_.merge(Webiny, {
			App,
			Module: WebinyModule,
            Modules: {},
            Mixins: {
                ApiComponent
            },
			Ui: {
				Component,
                Components: {
                    Hide,
                    Show,
                    Value
                },
				Dispatcher: UiDispatcher,
                FormComponent,
                ModalComponent,
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
            i18n,
            Cookies, // from js-cookies
			Http,
			Api: {
				Endpoint
			}
		});
	}
}

export default Module;
