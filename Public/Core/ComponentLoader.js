import EventManager from '/Core/EventManager';
import BaseClass from '/Core/Base/BaseClass';
import Router from '/Core/Router/Router';

class ComponentLoader extends BaseClass {

	constructor() {
		this.listeners = [];
	}

	getComponents(placeholder) {
		//console.log("LOADING COMPONENTS", placeholder + ' ' + Router.getActiveRoute().getPattern());
		// Get URL specific components
		var eventHash = md5(Router.getActiveRoute().getPattern() + placeholder);
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
				items.forEach(function (item, index) {
					var props = item.props || {};
					// Need to add 'key' to each component in the array so React does not complain about it
					props['key'] = index;
					elements.push(React.createElement(item.component, props));
				});
			});
		}
		return React.createElement.apply(undefined, ["div", null, elements]);
	}
}

export default new ComponentLoader;