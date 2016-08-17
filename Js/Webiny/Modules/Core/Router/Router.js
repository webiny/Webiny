import Dispatcher from './../Core/Dispatcher';
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
                const matched = Utils.matchRoute(this, url);
                if (!matched) {
                    return Utils.handleRouteNotMatched(url, this.routeNotMatched);
                }

                this.activeRoute = matched;
                Utils.routeWillChange(matched, this.routeWillChange).then(() => {
                    Utils.renderRoute(matched);
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
        // Validate route
        const samePattern = this.getRouteByPattern(route.getPattern());
        const sameName = this.getRoute(route.getName());
        if (samePattern || sameName) {
            // Name and pattern must match, otherwise we throw an error
            const nameMismatch = samePattern && samePattern.getName() !== route.getName();
            const patternMistmatch = sameName && sameName.getPattern() !== route.getPattern();
            if (nameMismatch) {
                return console.error('Route with URL `' + route.getPattern() + '` already exists! Either change your URL or use the existing name `' + samePattern.getName() + '`');
            }

            if (patternMistmatch) {
                return console.error('Route with name `' + route.getName() + '` already exists! Either change your name or use the existing URL `' + sameName.getPattern() + '`');
            }
        }

        const existingRoute = samePattern || sameName;

        if (existingRoute) {
            console.log('%c[Route][Merge]: ' + route.getName() + ' %c' + route.getPattern(), 'color: #666; font-weight: bold', 'color: blue; font-weight: bold');
            // Merge components
            _.forIn(route.components, (cmps, placeholder) => {
                if (!_.has(existingRoute.components, placeholder)) {
                    existingRoute.components[placeholder] = [];
                }
                existingRoute.components[placeholder] = cmps;
            });
        } else {
            console.log('%c[Route][Add]: ' + route.getName() + ' %c' + route.getPattern(), 'color: #666; font-weight: bold', 'color: blue; font-weight: bold');
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

        if (_.endsWith(url, '#')) {
            return e.preventDefault();
        }

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
