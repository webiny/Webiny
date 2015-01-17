import EventManager from '/Core/EventManager'
import Route from '/Core/Router/Route'

class Router {

	constructor() {
		this.namedParam = /:\w+/g;

		this.splatParam = /\*\w+/g;

		this.routes = {};

		this.activeRoute = new Route(History.getState());

		History.Adapter.bind(window, 'statechange', () => {
			return this.checkRoutes(History.getState());
		});
	}

	route(route, callback) {
		route = route.replace(this.namedParam, '([^\/]+)').replace(this.splatParam, '(.*?)');
		return this.routes["^" + route + "$"] = callback;
	}

	checkRoutes(state) {
		this.activeRoute = new Route(state);
		EventManager.emit('renderRoute', this.activeRoute);
		//console.log(EventManager.getListeners())
	}

	navigate(url, replace) {
		if (replace == null) {
			replace = false;
		}

		if (replace) {
			return History.replaceState({
				'url': url
			}, null, url);
		} else {
			return History.pushState({
				'url': url
			}, null, url);
		}
	}

	start(url) {
		var stateObj = {};
		if (url != null) {
			stateObj = {data: {url: url}};
		} else {
			stateObj = History.getState();
		}
		return this.checkRoutes(stateObj);
	}

	go(num) {
		return History.go(num);
	}

	back() {
		return History.back();
	}

	getActiveRoute() {
		return this.activeRoute;
	}
}

export default new Router;