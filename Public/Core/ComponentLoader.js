import EventManager from '/Core/EventManager';
import BaseClass from '/Core/Base/BaseClass';
import Router from '/Core/Router/Router';

class ComponentLoader extends BaseClass {

	constructor() {
		this.listeners = [];
	}

	getComponents(placeholder) {
		var elements = [];
		if (!Router.getActiveRoute()) {
			return React.createElement.apply(undefined, ["div", null, elements]);
		}
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

		if (components) {
			components.forEach(function (items) {
				if (Object.prototype.toString.call(items) === "[object Object]") {
					items = [items];
				}
				items.forEach(function (item, index) {
					var props = item.props || {};
					var newInstance = item.hasOwnProperty('newInstance') ? item.newInstance : true;
					if (newInstance) {
						// Need to add 'key' to each component in the array so React does not complain about it
						props['key'] = index;
						elements.push(React.createElement(item.component, props));
					} else {
						elements.push(item.component);
					}
				});
			});
		}
		return React.createElement.apply(undefined, ["div", null, elements]);
	}
}

export default new ComponentLoader;