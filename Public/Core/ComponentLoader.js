import EventManager from '/Core/EventManager';
import BaseClass from '/Core/Base/BaseClass';
import Router from '/Core/Router/Router';

let singleton = Symbol();
let singletonEnforcer = Symbol();

class ComponentLoader extends BaseClass {

	constructor(enforcer) {
		if (enforcer != singletonEnforcer) {
			throw "Cannot construct singleton";
		}
		this.listeners = [];
	}

	static getInstance() {
		if (!this[singleton]) {
			this[singleton] = new ComponentLoader(singletonEnforcer);
		}
		return this[singleton];
	}

	getComponents(placeholder) {
		console.log("LOADING COMPONENTS", placeholder + ' ' + Router.getActiveRoute().getUrl());
		// Get URL specific components
		var eventHash = md5(Router.getActiveRoute().getUrl() + placeholder);
		var routeComponents = EventManager.emit(eventHash);

		// Get global components
		eventHash = md5('*' + placeholder);
		var globalComponents = EventManager.emit(eventHash);

		var components = [];
		if (routeComponents) {
			routeComponents.map(x => components.push(x));
		}

		if (globalComponents) {
			globalComponents.map(x => components.push(x));
		}
		
		var elements = [];
		if (components) {
			components.forEach(function (items) {
				if (Object.prototype.toString.call(items) === "[object Object]") {
					items = [items];
				}
				items.forEach(function (item) {
					elements.push(React.createElement(item.component, item.params));
				});
			});
		}
		return React.createElement.apply(undefined, ["div", null, elements]);
	}
}

export default ComponentLoader;