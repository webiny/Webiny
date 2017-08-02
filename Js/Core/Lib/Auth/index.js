import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import Webiny from 'webiny';

class Auth {
    constructor() {
        this.showLogin = false;
        this.loginRoute = 'Login';
        this.forbiddenRoute = 'Forbidden';
    }

    init() {
        Webiny.Router.addRoute(new Webiny.Route(this.loginRoute, '/login', this.renderLogin(), 'Login').setLayout('empty'));
        Webiny.Router.addRoute(new Webiny.Route(this.forbiddenRoute, '/forbidden', this.renderForbidden(), 'Forbidden'));

        Webiny.Router.onBeforeStart(routerEvent => {
            Webiny.Http.addRequestInterceptor(http => {
                http.addHeader('X-Webiny-Authorization', Webiny.Cookies.get(this.getCookieName()));
            });

            // Watch if we got a forbidden request - then log out
            Webiny.Http.addResponseInterceptor(response => {
                if (response.status === 403) {
                    this.onForbidden(routerEvent, response);
                }

                if (response.status === 401 && response.data.code === 'WBY-AUTH-TOKEN-EXPIRED') {
                    if (this.showLogin) {
                        return;
                    }

                    this.showLogin = true;
                    response.data.message = 'Unfortunately we could not perform your latest action. You can retry as soon as you log in again.';

                    if (!document.querySelector('login-overlay')) {
                        document.body.appendChild(document.createElement('login-overlay'));
                    }

                    const target = document.querySelector('login-overlay');

                    const LoginView = this.renderLogin();

                    if (LoginView) {
                        const props = {
                            overlay: true,
                            onSuccess: () => {
                                this.showLogin = false;
                                ReactDOM.unmountComponentAtNode(target);
                            }
                        };

                        const {createElement, cloneElement, isValidElement} = React;
                        const view = isValidElement(LoginView) ? cloneElement(LoginView, props) : createElement(LoginView, props);
                        ReactDOM.render(view, target);
                    }
                }
            });

            return this.checkUser(routerEvent);
        });
        Webiny.Router.onRouteWillChange(this.checkUser.bind(this));
    }

    /**
     * Check if user is authenticated and authorized to visit requested route.
     * This method is the main "entry point" into the verification process.
     *
     * @param routerEvent
     * @returns {*}
     */
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
        return this.getUser().then(() => this.checkRouteRole(routerEvent));
    }

    checkRouteRole(routerEvent) {
        if (Webiny.Config.Js.CheckUserRoles && _.has(routerEvent.route, 'role')) {
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

    /**
     * This method checks if current target route is already a login route and redirects (or not) properly.
     *
     * @param routerEvent
     * @returns {*}
     */
    goToLogin(routerEvent) {
        localStorage.loginRedirect = window.location.href;

        const isLoginRoute = _.get(routerEvent.route, 'name') === this.loginRoute;

        if (!isLoginRoute) {
            routerEvent.stop();
            routerEvent.goToRoute(this.loginRoute);
        }

        return routerEvent;
    }

    onNoToken(routerEvent) {
        return this.goToLogin(routerEvent);
    }

    /**
     * Use the given user data to check if the user is authorized to be in this app.
     * This logic is completely specific to your application. Implement this as you see fit.
     *
     * This method is used by `verifyUser` and Login forms to check authorization of logged in user.
     *
     * @param user
     * @returns {boolean}
     */
    isAuthorized(user) {
        return !!_.find(user.roles, {slug: 'administrator'});
    }

    getUserFields() {
        return '*,roles.slug,gravatar';
    }

    /**
     * Fetch user profile and verify the returned data.
     *
     * @returns {Promise.<TResult>}
     */
    getUser() {
        return this.getApiEndpoint().get('/me', {_fields: this.getUserFields()}).then(apiResponse => {
            return Promise.resolve(this.verifyUser(apiResponse)).then(() => apiResponse);
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

    refresh() {
        return this.getUser();
    }

    logout(redirect = true) {
        let logout = Promise.resolve().then(() => {
            Webiny.Model.set('User', null);
            Webiny.Cookies.remove(this.getCookieName());
        });

        if (redirect) {
            logout = logout.then(() => Webiny.Router.goToRoute(this.loginRoute));
        }

        return logout;
    }

    /**
     * This method determines if the given response from the API is valid user data.
     * It also executes `isAuthorized` to see if given user is allowed to be in this app.
     *
     * This method can be overridden to suit your app's needs.
     * It is up to the developer to handle both `verified` and `unverified` cases as he sees fit.
     *
     * @param apiResponse
     * @returns {*}
     */
    verifyUser(apiResponse) {
        const data = apiResponse.getData();
        if (apiResponse.isError() || !this.isAuthorized(data)) {
            return this.logout();
        }
        Webiny.Model.set('User', data);
    }

    /**
     * Triggered when user is not authenticated
     */
    onForbidden() {
        this.logout();
    }

    renderLogin() {
        return null;
    }

    renderForbidden() {
        return null;
    }
}

export default Auth;