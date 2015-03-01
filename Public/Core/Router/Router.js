import EventManager from '/Core/EventManager'
import Route from '/Core/Router/Route'

class Router {

	constructor() {
		this.routes = {};
		this.activeRoute = null;

		History.Adapter.bind(window, 'statechange', () => {
			return this.checkRoutes(History.getState().data.url || History.getState().url);
		});
	}

	addRoute(name, route) {
		if (route instanceof Route) {
			this.routes[name] = route;
		}
	}

	getParam(param) {
		return this.activeRoute.getParams(param);
	}

	getHref(pattern = null, params = {}) {
		if (pattern instanceof Object) {
			return this.getActiveRoute().getHref(pattern);
		}

		var url = null;
		Object.keys(this.routes).forEach(name => {
			var route = this.routes[name];
			if (route.getPattern() == pattern) {
				url = route.getHref(params);
			}
		})
		return url;
	}

	getRoutePath(route){
		if(!this.routes[route]){
			return null;
		}

		return this.routes[route].getPattern();
	}

	checkRoutes(url) {
		url = this._sanitizeUrl(url);
		Object.keys(this.routes).forEach(name => {
			var route = this.routes[name];
			if (route.match(url)) {
				this.activeRoute = route;
				EventManager.emit('renderRoute', this.activeRoute);
			}
		});
	}

	goTo(url, replace) {
		url = this.getRoutePath(url) || url;

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
		url = url || History.getState().data.url;
		return this.checkRoutes(url);
	}

	goBack() {
		return History.back();
	}

	getActiveRoute() {
		return this.activeRoute;
	}

	setActiveRoute(url) {
		url = this._sanitizeUrl(url);
		Object.keys(this.routes).forEach(name => {
			var route = this.routes[name];
			if (route.match(url)) {
				this.activeRoute = route;
			}
		});
	}

	_sanitizeUrl(url) {
		return url.replace(_appUrl, '').split('?').shift();
	}
}

export default new Router;