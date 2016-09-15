import Webiny from 'Webiny';
import Forbidden from './Views/Forbidden';

class Module extends Webiny.Module {

    getCookieName() {
        return 'webiny-token';
    }

    /**
     * Triggered when user is not authenticated
     *
     * @param routerEvent
     * @param apiResponse
     */
    onForbidden() {
        Q.all([
            Webiny.Dispatcher.dispatch('Logout')
        ]).then(() => {
            Webiny.Router.goToRoute('Login');
        });
    }

    onNoToken(routerEvent) {
        const isLoginRoute = _.get(routerEvent.route, 'name') === 'Login';

        if (!isLoginRoute) {
            localStorage.loginRedirect = window.location.href;
            routerEvent.stop();
            routerEvent.goToRoute('Login');
        }

        return routerEvent;
    }

    onVerifyUser(routerEvent, apiResponse) {
        const data = apiResponse.getData();
        if (!_.find(data.roles, {slug: 'administrator'})) {
            Webiny.Cookies.remove(this.getCookieName());
            return this.goToLogin(routerEvent);
        }
        Webiny.Model.set('User', data);

        return routerEvent;
    }

    onLogout() {
        Webiny.Model.set('User', null);
        Webiny.Cookies.remove(this.getCookieName());
        Webiny.Router.goToRoute('Login');
    }

    getUserEntity() {
        return '/core/users';
    }

    getUserFields() {
        return '*,roles.slug';
    }

    getUser(routerEvent) {
        return new Webiny.Api.Endpoint('/entities' + this.getUserEntity()).get('/me', {_fields: this.getUserFields()}).then(apiResponse => {
            return this.onVerifyUser(routerEvent, apiResponse);
        });
    }

    renderForbidden() {
        return <Forbidden/>;
    }

    goToLogin(routerEvent) {
        localStorage.loginRedirect = window.location.href;
        routerEvent.stop();

        const isLoginRoute = _.get(routerEvent.route, 'name') === 'Login';

        if (!isLoginRoute) {
            routerEvent.goToRoute('Login');
        }

        return routerEvent;
    }

    run() {
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

    checkRouteRole(routerEvent) {
        const user = Webiny.Model.get('User');

        if (user && _.has(routerEvent.route, 'role') && !_.find(user.roles, r => routerEvent.route.role.indexOf(r.slug) > -1)) {
            routerEvent.stop();
            routerEvent.goToRoute('Forbidden');
        }
        return routerEvent;
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
}

export default Module;