import EventManager from './../EventManager';
import RouterEvent from './RouterEvent';
import Utils from './RouterUtils';

/**
 * ROUTER
 * Router class is responsible for HTML5 URLs and serving view components
 */
class Router {

	constructor() {
		this.baseUrl = null;
		this.appUrl = '';
		this.routes = [];
		this.defaultComponents = {};
		this.defaultRoute = null; // If router didn't match anything, it will reroute here
		this.activeRoute = null;
		this.beforeStart = [];
		this.routeWillChange = [];

		History.Adapter.bind(window, 'statechange', () => {
			let matchedRoute = Utils.matchRoute(this, History.getState().data.url || History.getState().url);
			this.activeRoute = matchedRoute;
			Utils.routeWillChange(matchedRoute, this.routeWillChange).then(() => {
				Utils.renderRoute(matchedRoute);
			}, Utils.exceptionHandler);
		});
	}

	start(url) {
		url = url || History.getState().data.url;
		let matchedRoute = Utils.matchRoute(this, url);

		if (!matchedRoute) {
			matchedRoute = this.defaultRoute;
		}

		this.activeRoute = matchedRoute;

		/**
		 * Execute beforeStart callbacks in a chain and see if start is prevented
		 */

		let routerEvent = new RouterEvent(matchedRoute);
		let beforeStartChain = Q(routerEvent);
		this.beforeStart.forEach(callback => {
			beforeStartChain = beforeStartChain.then(() => {
				return callback(routerEvent);
			});
		});

		beforeStartChain = beforeStartChain.then(routerEvent => {
			if (!routerEvent.isStopped()) {
				Utils.renderRoute(routerEvent.route);
			} else {
				if (routerEvent.goTo != null) {
					this.goToRoute(routerEvent.goTo, routerEvent.goToParams);
				}
			}
		});


		return beforeStartChain;
	}

	onBeforeStart(callback) {
		this.beforeStart.push(callback);
		return this;
	}

	onRouteWillChange(callback) {
		this.routeWillChange.push(callback);
		return this;
	}

	addDefaultComponents(components) {
		_.each(components, (component, placeholder) => {
			if (!this.defaultComponents[placeholder]) {
				this.defaultComponents[placeholder] = [];
			}

			if (_.isArray(component)) {
				this.defaultComponents[placeholder].concat(component)
			} else {
				this.defaultComponents[placeholder].push(component)
			}
		});
		return this;
	}

	getDefaultComponents(placeholder = false) {
		let components;
		if (placeholder) {
			components = _.get(this.defaultComponents, placeholder, []);
			return _.isArray(components) ? components : [components];
		}
		return this.defaultComponents;
	}

	addRoutes() {
		_.forIn(arguments, route => this.addRoute(route));
		return this;
	}

	addRoute(route) {
		Webiny.Console.log("%c[Route]: " + route.getName() + " %c" + route.getPattern(), 'color: #666; font-weight: bold', 'color: blue; font-weight: bold');
		this.routes.push(route);
		return this;
	}

	getRoute(name) {
		let route = _.find(this.routes, 'name', name);
		if (!route) {
			Webiny.Console.error('Route by name: ' + name + ' does not exist.');
			return false;
		}
		return route;
	}

	getParam(param) {
		return this.activeRoute.getParams(param);
	}

	getHref(params = {}) {
		return this.getActiveRoute().getHref(params);
	}

	goToRoute(name, params = {}, merge = true) {
		let route = this.activeRoute;
		if (name != 'current') {
			route = _.find(this.routes, 'name', name);
		}

		if (!route) {
			console.error('Route by name: ' + name + ' does not exist.');
			return null;
		}

		if (route == this.activeRoute && _.isEqual(params, this.activeRoute.getParams())) {
			Webiny.Console.warn('Route will not change!');
			return null;
		}
		return this.goToUrl(route.getHref(params, null, merge));
	}

	goToUrl(url, replace = false) {
		if (url.indexOf(this.baseUrl) !== 0) {
			url = this.baseUrl + url
		}

		if (replace) {
			History.replaceState({url: url, replace: true}, null, url);
		} else {
			History.pushState({url: url}, null, url);
		}
		return url;
	}


	goBack() {
		return History.back();
	}

	getActiveRoute() {
		return this.activeRoute;
	}

	getCurrentPathName(addon = '') {
		return window.location.pathname + addon;
	}

	setBaseUrl(url) {
		if (!this.baseUrl) {
			this.baseUrl = url;
			this.appUrl = window.location.origin + this.baseUrl;
		}
		Utils.setBaseUrl(this.baseUrl);
		return this;
	}

	setDefaultRoute(route) {
		this.defaultRoute = route;
		return this;
	}

	getDefaultRoute(route) {
		return this.defaultRoute;
	}

	getBaseUrl() {
		return this.baseUrl;
	}

	handleAnchorClick(a, e) {
		let href = a.href;

		if (_.endsWith(href, '#')) {
			return e.preventDefault();
		}

		if (href.indexOf(this.appUrl) === 0) {
			href = href.replace(window.location.origin, '');
			e.preventDefault();
			this.goToUrl(href);
		}
	}
}

let router = new Router;

/**
 * Observe clicks on anchors and handle them accordingly
 */
$(document).on('click', 'a', function (e) {
	router.handleAnchorClick(this, e);

});

export default router;