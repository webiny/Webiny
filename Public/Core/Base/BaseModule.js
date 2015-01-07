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
				EventManager.addListener(eventHash, () => {
					return component;
				})
			});
		});

		var _this = this;
		var stores = this.registerStores();
		Object.keys(stores).forEach(function(fqn) {
			var storeInstance = new stores[fqn]();
			storeInstance.__fqn = fqn;
			storeInstance.init();
			_this.getRegistry().addStore(storeInstance);
		});
	}

	getComponent(component){
		return (new component).getComponent();
	}

	registerRoutes(){
		return {};
	}

	registerStores(){
		return {};
	}
}

export default BaseModule;