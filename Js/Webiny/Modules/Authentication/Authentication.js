import Webiny from 'Webiny';

class Module extends Webiny.Module {

    getCookieName() {
        return 'webiny-token';
    }

    onForbidden(routerEvent, apiResponse) {
        Q.all([
            Webiny.Dispatcher.dispatch('Logout')
        ]).then(() => {
            Webiny.Router.goToRoute('Login', {logout: 'expired'});
        });
    }

    onNoToken(routerEvent) {
        localStorage.loginRedirect = window.location.href;
        routerEvent.stop();

        var isLoginRoute = routerEvent.route.name === 'Login';

        if (!isLoginRoute) {
            routerEvent.goToRoute('Login', {logout: 'not'});
        }

        return routerEvent;
    }

    onVerifyUser(routerEvent, apiResponse) {
        const data = apiResponse.getData();
        if (!_.find(data.groups, {tag: 'administrators'})) {
            Webiny.Cookies.remove(this.getCookieName());
            return this.goToLogin(routerEvent);
        } else {
            Webiny.Model.set('User', data);
        }

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
        return '*,groups.tag,!password';
    }

    getUser(routerEvent) {
        return new Webiny.Api.Entity(this.getUserEntity()).get('/me', {_fields: this.getUserFields()}).then(apiResponse => {
            return this.onVerifyUser(routerEvent, apiResponse);
        });
    }

    goToLogin(routerEvent) {
        localStorage.loginRedirect = window.location.href;
        routerEvent.stop();

        var isLoginRoute = routerEvent.route.name == 'Login';

        if (!isLoginRoute) {
            routerEvent.goToRoute('Login');
        }

        return routerEvent;
    }

    run() {
        Webiny.Dispatcher.on('Logout', this.onLogout.bind(this));

        Webiny.Router.onBeforeStart(routerEvent => {
            Webiny.Http.addRequestInterceptor(http => {
                http.addHeader('Authorization', Webiny.Cookies.get(this.getCookieName()));
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
            return;
        }

        const token = Webiny.Cookies.get(this.getCookieName());

        // Check if token exists on client side
        if (!token) {
            return this.onNoToken(routerEvent);
        }

        // Try fetching user data
        return this.getUser(routerEvent);
    }
}

export default Module;