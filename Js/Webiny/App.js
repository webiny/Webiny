import App from './Lib/App';
import Module from './Lib/Module';
import Component from './Lib/Component';
import View from './Lib/View';
import EventManager from './Lib/EventManager';
import Router from './Lib/Router/Router';
import Route from './Lib/Router/Route';
import Registry from './Lib/Registry';
import Components from './Components/Components';
import Custom from './Custom/Custom';
import Views from './Views/Views';
import Http from './Lib/Http/Http';
import Tools from './Lib/Tools';
import Console from './Lib/Console';
import Base from './Lib/Store/Base';
import Api from './Lib/Store/Api';
import Entity from './Lib/Store/Entity';
import List from './Lib/Store/List';

import Service from './Lib/Api/Service';
import EntityService from './Lib/Api/EntityService';

let Rad = {
	App,
	Module,
	Component,
	View,
	Router,
	Route,
	EventManager,
	Registry,
	Components,
	Custom,
	Views,
	Tools,
	Console: Console.init(),
	Http,
	Api: {
		Service,
		EntityService
	},
	Store: {
		Base,
		Entity,
		List
	},

	run: function () {
		console.log("Running Webiny!!! :)");
		// Run app
		let appElement = document.querySelector('rad-app');
		if (appElement) {
			let appName = appElement.attributes.name.nodeValue;
			let baseUrl = appElement.attributes['base-url'].nodeValue;
			Rad.Router.setBaseUrl(baseUrl);
			System.import(appName).then(app => {
				window.Webiny.Apps[appName] = app.default;
				window.Webiny.Apps[appName].run(appElement);
			});
		}

		// Mount components
		let componentElements = document.querySelectorAll('rad-component');
		if (componentElements) {
			_.each(componentElements, el => {
				let props = {};
				_.each(el.attributes, attr => {
					props[attr.nodeName] = attr.nodeValue;
				});

				let component = _.get(window, props.name);
				if (component) {
					let element = React.createElement(component, props, el.innerHTML);
					ReactDOM.render(element, el);
				} else {
					el.remove();
				}
			});
		}
	}
};

window.Webiny = Rad;

export default Rad;