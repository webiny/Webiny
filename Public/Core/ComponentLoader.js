import EventManager from '/Core/EventManager';

let singleton = Symbol();
let singletonEnforcer = Symbol();

class ComponentLoader {

	constructor(enforcer) {
		if (enforcer != singletonEnforcer) throw "Cannot construct singleton";
		this.listeners = [];
	}

	static getInstance() {
		if (!this[singleton]) {
			this[singleton] = new ComponentLoader(singletonEnforcer);
		}
		return this[singleton];
	}

	getComponents(placeholder) {
		console.log("LOADING PLACEHOLDER", placeholder);
		var eventHash = md5(activeRoute.url + placeholder);
		var components = EventManager.getInstance().emit(eventHash);
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