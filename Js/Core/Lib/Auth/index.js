import Webiny from 'Webiny';
import Forbidden from './Views/Forbidden';
import Login from './Views/Login';

class Auth {
    constructor() {
        this.loginRoute = 'Login';
        this.forbiddenRoute = 'Forbidden';
    }

    init() {
        Webiny.Router.addRoute(new Webiny.Route(this.loginRoute, '/login', this.renderLogin(), 'Login').setLayout('empty'));
        Webiny.Router.addRoute(new Webiny.Route(this.forbiddenRoute, '/forbidden', this.renderForbidden(), 'Forbidden'));

        Webiny.Dispatcher.on('Logout', this.onLogout.bind(this));

        Webiny.Router.onBeforeStart(routerEvent => {
            Webiny.Http.addRequestInterceptor(http => {
                http.addHeader('X-Webiny-Authorization', Webiny.Cookies.get(this.getCookieName()));
            });

            // Watch if we got a forbidden request - then log out
            Webiny.Http.addResponseInterceptor(response => {
                if (response.status === 403) {
                    this.onForbidden(routerEvent, response);
                }
            });

            return this.checkUser(routerEvent);
        });


        Webiny.Router.onRouteWillChange(this.checkUser.bind(this));
    }

    checkUser(routerEvent) {
        if (Webiny.Model.get('User')) {
            return this.checkRouteRole(routerEvent);
        }

        const token = Webiny.Cookies.get(this.getCookieName());

        // Check if token exists on client side
        if (!token) {
            return this.onNoToken(routerEvent);
        }

        // Try fetching user data
        return this.getUser(routerEvent).then(this.checkRouteRole.bind(this));
    }

    isAuthorized(user) {
        return _.find(user.roles, {slug: 'administrator'}) !== undefined;
    }

    checkRouteRole(routerEvent) {
        if (webinyConfig.CheckUserRoles && _.has(routerEvent.route, 'role')) {
            return new Promise((resolve) => {
                const user = Webiny.Model.get('User');

                if (user && _.isArray(routerEvent.route.role) && _.find(user.roles, r => routerEvent.route.role.indexOf(r.slug) > -1)) {
                    return resolve(routerEvent);
                }

                if (user && _.isFunction(routerEvent.route.role)) {
                    return Promise.resolve(routerEvent.route.role(routerEvent.route)).then(allowed => {
                        if (!allowed) {
                            routerEvent.stop();
                            routerEvent.goToRoute(this.forbiddenRoute);
                        }
                        resolve(routerEvent);
                    });
                }

                routerEvent.stop();
                routerEvent.goToRoute(this.forbiddenRoute);
                resolve(routerEvent);
            });
        }
        return Promise.resolve(routerEvent);
    }

    getUserFields() {
        return '*,roles.slug,gravatar';
    }

    getUser(routerEvent) {
        return this.getApiEndpoint().get('/me', {_fields: this.getUserFields()}).then(apiResponse => {
            return this.onVerifyUser(routerEvent, apiResponse);
        });
    }

    getCookieName() {
        return 'webiny-token';
    }

    getApiEndpoint() {
        if (!this.authApi) {
            this.authApi = new Webiny.Api.Endpoint('/entities/webiny/users')
        }
        return this.authApi;
    }

    /**
     * Triggered when user is not authenticated
     */
    onForbidden() {
        return Webiny.Dispatcher.dispatch('Logout').then(() => {
            Webiny.Router.goToRoute(this.loginRoute);
        });
    }

    onNoToken(routerEvent) {
        const isLoginRoute = _.get(routerEvent.route, 'name') === this.loginRoute;

        if (!isLoginRoute) {
            localStorage.loginRedirect = window.location.href;
            routerEvent.stop();
            routerEvent.goToRoute(this.loginRoute);
        }

        return routerEvent;
    }

    onVerifyUser(routerEvent, apiResponse) {
        const data = apiResponse.getData();
        if (!this.isAuthorized(data)) {
            Webiny.Cookies.remove(this.getCookieName());
            return this.goToLogin(routerEvent);
        }
        Webiny.Model.set('User', data);

        return routerEvent;
    }

    onLogout() {
        Webiny.Model.set('User', null);
        Webiny.Cookies.remove(this.getCookieName());
        Webiny.Router.goToRoute(this.loginRoute);
    }

    goToLogin(routerEvent) {
        localStorage.loginRedirect = window.location.href;
        routerEvent.stop();

        const isLoginRoute = _.get(routerEvent.route, 'name') === this.loginRoute;

        if (!isLoginRoute) {
            routerEvent.goToRoute(this.loginRoute);
        }

        return routerEvent;
    }

    renderLogin() {
        return Login;
    }

    renderForbidden() {
        return Forbidden;
    }
}

export default Auth;