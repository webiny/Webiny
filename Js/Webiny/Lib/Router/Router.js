import Webiny from 'Webiny';
import RouterEvent from './RouterEvent';
import Utils from './RouterUtils';
import Dispatcher from './../Core/Dispatcher';
import 'historyjs/scripts/bundled-uncompressed/html5/native.history';
import 'jquery-deparam';

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
        this.routeChanged = [];
        this.routeNotMatched = [];
        this.started = false;
    }

    start() {
        if (!this.baseUrl) {
            return Promise.resolve();
        }

        if (!this.started) {
            this.started = true;
            const $this = this;
            $(document).on('click', 'a', function handleClick(e) {
                $this.handleAnchorClick(this, e);
            });

            History.Adapter.bind(window, 'statechange', () => {
                this.activeRoute = null;
                let url = History.getState().data.url || History.getState().hash;
                url = url.replace(this.appUrl, '');
                if (url === '') {
                    url = '/';
                }

                if (!url.startsWith(this.baseUrl)) {
                    return Utils.handleRouteNotMatched(url, this.routeNotMatched);
                }
                const matched = Utils.matchRoute(this, url);
                if (!matched) {
                    return Utils.handleRouteNotMatched(url, this.routeNotMatched);
                }

                this.activeRoute = matched;
                if (History.getState().data.title) {
                    this.activeRoute.setTitle(History.getState().data.title);
                }

                Utils.routeWillChange(matched, this.routeWillChange).then(routerEvent => {
                    if (!routerEvent.isStopped()) {
                        Utils.renderRoute(matched).then(route => {
                            Dispatcher.dispatch('RouteChanged', new RouterEvent(route));
                        });
                    }
                }).catch(Utils.exceptionHandler);
            });

            // Listen for "RouteChanged" event and process callbacks
            Dispatcher.on('RouteChanged', (event) => {
                if (_.isNumber(History.getState().data.scrollY)) {
                    window.scrollTo(0, History.getState().data.scrollY);
                }
                let chain = Promise.resolve(event);
                this.routeChanged.forEach(callback => {
                    chain = chain.then(() => {
                        return callback(event);
                    }).catch(Utils.exceptionHandler);
                });
                return chain;
            });
        }

        const url = window.location.pathname;
        const matchedRoute = Utils.matchRoute(this, url);
        this.activeRoute = matchedRoute;

        /**
         * Execute beforeStart callbacks in a chain and see if start is prevented
         */
        const routerEvent = new RouterEvent(matchedRoute, true);
        let beforeStartChain = Promise.resolve(routerEvent);
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
                Utils.renderRoute(event.route).then(route => {
                    Dispatcher.dispatch('RouteChanged', new RouterEvent(route, true));
                });
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

    onRouteChanged(callback) {
        this.routeChanged.push(callback);
        return this;
    }

    onRouteNotMatched(callback) {
        this.routeNotMatched.push(callback);
        return this;
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

    setDefaultComponents(components) {
        _.assign(this.defaultComponents, components);
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

    deleteRoute(name) {
        const index = _.findIndex(this.routes, {name});
        if (index > -1) {
            this.routes.splice(index, 1);
        }
        return this;
    }

    routeExists(name) {
        return _.find(this.routes, {name}) ? true : false;
    }

    getRoute(name) {
        const route = _.find(this.routes, {name});
        if (!route) {
            return false;
        }
        return route;
    }

    getRouteByPattern(pattern) {
        const route = _.find(this.routes, {pattern});
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

    goToRoute(route, params = {}, options = {}) {
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
        return this.goToUrl(route.getHref(params, null), false, options);
    }

    goToUrl(url, replace = false, options = {}) {
        // Strip app URL if present
        url = url.replace(this.appUrl, '');
        if (url.indexOf(this.baseUrl) !== 0) {
            url = this.baseUrl + url;
        }

        const state = {
            url,
            replace,
            scrollY: options.preventScroll ? window.scrollY : false,
            title: options.title
        };

        if (replace) {
            History.replaceState(state, window.document.title, url);
        } else {
            History.pushState(state, window.document.title, url);
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

    setTitle(title) {
        Webiny.Page.setTitle(this.getTitlePattern().replace('%s', title));
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
            History.pushState({
                url,
                title: a.getAttribute('data-document-title') || null,
                scrollY: a.getAttribute('data-prevent-scroll') === 'true' ? window.scrollY : false
            }, window.document.title, url);
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
