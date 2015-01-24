import EventManager from '/Core/EventManager'
import Route from '/Core/Router/Route'

class Router {

	constructor() {
		this.routes = [];
		this.activeRoute = null;

		History.Adapter.bind(window, 'statechange', () => {
			return this.checkRoutes(History.getState().data.url);
		});
	}

	addRoute(route) {
		if(route instanceof Route){
			this.routes.push(route);
		}
	}

	getParam(param){
		return this.activeRoute.getParams(param);
	}

	checkRoutes(url) {
		url = this._sanitizeUrl(url);
		this.routes.forEach((route) => {
			if (route.match(url)) {
				this.activeRoute = route;
				EventManager.emit('renderRoute', this.activeRoute);
			}
		});
	}

	goTo(url, replace) {
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
		this.routes.forEach((route) => {
			if (route.match(url)) {
				this.activeRoute = route;
			}
		});
	}

	_sanitizeUrl(url) {
		return url.replace(_appUrl, '');
	}
}

export default new Router;