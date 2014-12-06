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
	}

	getComponent(component){
		return (new component).getComponent();
	}
}

export default BaseModule;