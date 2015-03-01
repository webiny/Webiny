import EventManager from '/Core/EventManager'
import BaseClass from '/Core/Base/BaseClass'
import Route from '/Core/Router/Route'

class BaseModule extends BaseClass {

	constructor() {
		var components = this.registerComponents();
		Object.keys(components).forEach(function (name) {
			var component = components[name];
			if (window.hasOwnProperty(name)) {
				throw Error('Component with name `' + name + '` is already registered!');
			}
			window[name] = component.createComponent();
		});

		var routes = this.registerRoutes();
		Object.keys(routes).forEach(function (routeName) {
			var routeData = routes[routeName];
			var placeholders = routeData['Content'];
			var path = '/' + _backendPrefix + routeData['Path'];
			routeData['Path'] = path;
			Router.addRoute(routeName, new Route(path));
			Object.keys(placeholders).forEach(function (placeholder) {
				var component = placeholders[placeholder];
				var eventHash = md5(path + placeholder);
				var meta = {
					listenerType: 'route',
					placeholder: placeholder,
					route: path
				};
				EventManager.addListener(eventHash, () => {
					return component;
				}, meta)
			});
		});

		this.registerStores().forEach((store) => {
			var storeInstance = new store;
			this.getRegistry().addStore(storeInstance, {initialized: false});
		});
	}

	getComponent(component) {
		return (new component).getComponent();
	}

	registerComponents() {
		return {};
	}

	registerRoutes() {
		return {};
	}

	registerStores() {
		return [];
	}
}

export default BaseModule;