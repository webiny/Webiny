import EventManager from '/Core/EventManager'
import BaseClass from '/Core/Base/BaseClass'

class BaseModule extends BaseClass {

	constructor(){
		var routes = this.registerRoutes();
		Object.keys(routes).forEach(function (route) {
			var placeholders = routes[route];
			Object.keys(placeholders).forEach(function (placeholder) {
				var component = placeholders[placeholder];
				var eventHash = md5(route + placeholder);
				var meta = {
					listenerType: 'route',
					placeholder: placeholder,
					route: route
				};
				EventManager.addListener(eventHash, () => {
					return component;
				}, meta)
			});
		});

		this.registerStores().forEach((store) => {
			var storeInstance = new store;
			storeInstance.init();
			this.getRegistry().addStore(storeInstance);
		});
	}

	getComponent(component){
		return (new component).getComponent();
	}

	registerRoutes(){
		return {};
	}

	registerStores(){
		return [];
	}
}

export default BaseModule;