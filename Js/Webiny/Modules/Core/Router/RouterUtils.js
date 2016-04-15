import Webiny from 'Webiny';
import Dispatcher from './../Core/Dispatcher';
import RouterEvent from './RouterEvent';

class RouterUtils {

    constructor() {
        this.baseUrl = null;
    }

    setBaseUrl(url) {
        this.baseUrl = url;
        return this;
    }

    /**
     * When using promises, in our case Q library which is based on ES6 Promise class, thrown exceptions are suppressed by default.
     * Q library has support for handling that by passing second parameter to `then()`, so this is the exceptionHandler we pass to Q
     * when we need to log those exceptions.
     *
     * @param e
     */
    exceptionHandler(e) {
        console.error(e);
    }

    matchRoute(_this, url) {
        url = this.sanitizeUrl(url);
        let matchedRoute = null;
        _.each(_this.routes, route => {
            if (route.match(url) && !matchedRoute) {
                matchedRoute = route;
                console.log('%c[Router]: ' + url, 'color: #139C09; font-weight: bold');
            }
        });

        return matchedRoute;
    }

    /**
     * RENDER ROUTE
     * @param route
     */
    renderRoute(route) {
        return Dispatcher.dispatch('RenderRoute', route);
    }

    sanitizeUrl(url) {
        let sUrl = url.replace(this.baseUrl, '').split('?').shift();
        if (sUrl === '') {
            sUrl = '/';
        }
        return sUrl;
    }

    /**
     * BUILD `ROUTE WILL CHANGE` CHAIN
     * Create and execute chain of callbacks
     * @param matchedRoute
     * @param callbacks
     */
    routeWillChange(matchedRoute, callbacks) {
        function createLink(callback) {
            return function chainLink(routerEvent) {
                if (!routerEvent.isStopped()) {
                    return callback(routerEvent);
                }

                if (routerEvent.goTo !== null) {
                    Webiny.Router.goToRoute(routerEvent.goTo, routerEvent.goToParams);
                }

                return routerEvent;
            };
        }

        // Execute before change callbacks in a chain
        const routerEvent = new RouterEvent(matchedRoute);
        let routeWillChangeChain = Q(routerEvent);
        callbacks.forEach(callback => {
            routeWillChangeChain = routeWillChangeChain.then(createLink(callback), this.exceptionHandler);
        });

        return routeWillChangeChain;
    }
}

export default new RouterUtils();
