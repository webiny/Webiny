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
        this.layouts = {};
        this.defaultRoute = null; // If router didn't match anything, it will reroute here
        this.titlePattern = '{title}';
        this.activeRoute = null;
        this.beforeStart = [];
        this.routeWillChange = [];
        this.routeNotMatched = [];
        this.started = false;
    }

    start() {
        if (!this.baseUrl) {
            return Q();
        }

        if (!this.started) {
            this.started = true;
            const $this = this;
            $(document).on('click', 'a', function handleClick(e) {
                $this.handleAnchorClick(this, e);
            });

            History.Adapter.bind(window, 'statechange', () => {
                const url = History.getState().data.url || History.getState().url;
                if (!url.startsWith(this.baseUrl)) {
                    return Utils.handleRouteNotMatched(url, this.routeNotMatched);
                }
                const matched = Utils.matchRoute(this, url);
                if (!matched) {
                    return Utils.handleRouteNotMatched(url, this.routeNotMatched);
                }

                this.activeRoute = matched;
                Utils.routeWillChange(matched, this.routeWillChange).then(routerEvent => {
                    if (!routerEvent.isStopped()) {
                        Utils.renderRoute(matched);
                    }
                }).catch(Utils.exceptionHandler);
            });
        }

        const url = window.location.pathname;
        const matchedRoute = Utils.matchRoute(this, url);
        this.activeRoute = matchedRoute;

        /**
         * Execute beforeStart callbacks in a chain and see if start is prevented
         */
        const routerEvent = new RouterEvent(matchedRoute);
        let beforeStartChain = Q(routerEvent);
        this.beforeStart.forEach(callback => {
            beforeStartChain = beforeStartChain.then(() => {
                return callback(routerEvent);
            }).catch(Utils.exceptionHandler);
        });

        beforeStartChain = beforeStartChain.then(event => {
            if (!event.isStopped() || event.goTo === null) {
                if (!matchedRoute) {
                    return Utils.handleRouteNotMatched(url, this.routeNotMatched);
                }
                Utils.renderRoute(event.route);
            } else {
                if (event.goTo !== null) {
                    this.goToRoute(event.goTo, event.goToParams);
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

    onRouteNotMatched(callback) {
        this.routeNotMatched.push(callback);
        return this;
    }

    reloadRoute() {
        Utils.renderRoute(this.activeRoute);
    }

    addLayout(name, component) {
        this.layouts[name] = component;
        return this;
    }

    getLayout(name) {
        if (!_.has(this.layouts, name)) {
            console.warn('Layout "' + name + '" not found in Webiny.Router! Make sure you have registered your layout before using it.');
        }
        return this.layouts[name] || null;
    }

    addDefaultComponents(components) {
        _.each(components, (component, placeholder) => {
            if (!this.defaultComponents[placeholder]) {
                this.defaultComponents[placeholder] = [];
            }

            if (_.isArray(component)) {
                this.defaultComponents[placeholder].concat(component);
            } else {
                this.defaultComponents[placeholder].push(component);
            }
        });
        return this;
    }

    getDefaultComponents() {
        return this.defaultComponents;
    }

    addRoute(route) {
        const index = _.findIndex(this.routes, {name: route.name});
        if (index > -1) {
            this.routes[index] = route;
        } else {
            this.routes.push(route);
        }
        return this;
    }

    routeExists(name) {
        return _.find(this.routes, ['name', name]) ? true : false;
    }

    getRoute(name) {
        const route = _.find(this.routes, ['name', name]);
        if (!route) {
            return false;
        }
        return route;
    }

    getRouteByPattern(pattern) {
        const route = _.find(this.routes, ['pattern', pattern]);
        if (!route) {
            return false;
        }
        return route;
    }

    getParams(param) {
        return this.activeRoute.getParams(param);
    }

    getQueryParams(param) {
        return this.activeRoute.getQueryParams(param);
    }

    setQueryParams(params) {
        this.goToRoute('current', params);
    }

    getHref(params = {}) {
        return this.getActiveRoute().getHref(params);
    }

    goToRoute(route, params = {}) {
        if (_.isString(route)) {
            route = route !== 'current' ? _.find(this.routes, ['name', route]) : this.activeRoute;
        }

        if (!route) {
            return null;
        }

        if (route === this.activeRoute && _.isEqual(params, this.activeRoute.getParams())) {
            console.warn('Route will not change!');
            return null;
        }
        return this.goToUrl(route.getHref(params, null));
    }

    goToUrl(url, replace = false) {
        if (url.indexOf(this.baseUrl) !== 0) {
            url = this.baseUrl + url;
        }

        if (replace) {
            History.replaceState({url, replace: true}, null, url);
        } else {
            History.pushState({url}, null, url);
        }
        return url;
    }

    goBack() {
        return History.back();
    }

    getActiveRoute() {
        return this.activeRoute;
    }

    setBaseUrl(url) {
        if (!this.baseUrl) {
            this.baseUrl = url;
            this.appUrl = window.location.origin + this.baseUrl;
        }
        Utils.setBaseUrl(this.baseUrl);
        return this;
    }

    setTitlePattern(pattern) {
        this.titlePattern = pattern;
        return this;
    }

    getTitlePattern() {
        return this.titlePattern;
    }

    /**
     * Route name
     * @param route
     * @returns {Router}
     */
    setDefaultRoute(route) {
        this.defaultRoute = route;
        return this;
    }

    getDefaultRoute() {
        return _.isString(this.defaultRoute) ? this.getRoute(this.defaultRoute) : this.defaultRoute;
    }

    getBaseUrl() {
        return this.baseUrl;
    }

    handleAnchorClick(a, e) {
        let url = a.href;

        // _blank links should not be intercepted
        if (a.target === '_blank') {
            return;
        }

        // Prevent scrolling to top when clicking on '#' link
        if (_.endsWith(url, '#')) {
            e.preventDefault();
            return;
        }

        // Check if it's an anchor link
        if (url.indexOf('#') > -1) {
            return;
        }

        // Push state and let the Router process the rest
        if (url.indexOf(webinyWebPath) === 0) {
            e.preventDefault();
            url = url.replace(webinyWebPath, '');
            History.pushState({url}, null, url);
        }
    }

    sortersToString(sorters) {
        const sort = [];
        _.each(sorters, (value, field) => {
            if (value === 1) {
                sort.push(field);
            } else {
                sort.push('-' + field);
            }
        });
        return sort.length ? sort.join(',') : null;
    }
}

export default new Router;
