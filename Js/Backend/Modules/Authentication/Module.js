import Webiny from 'Webiny';
import Login from './Login';

class Authentication extends Webiny.Modules.Authentication {

    init() {
        this.registerRoutes(
            new Webiny.Route('Login', '/login', {
                MasterLayout: Login
            }, 'Login').skipDefaultComponents(true),
            new Webiny.Route('Forbidden', '/forbidden', {
                MasterContent: this.renderForbidden()
            }, 'Forbidden')
        );

        // Periodically check if logged in user is still an administrator and update his most recent data
        const api = new Webiny.Api.Endpoint('/entities/core/users');
        setInterval(() => {
            const user = Webiny.Model.get('User');
            if (!user) {
                return;
            }

            api.get('/me', {_fields: this.getUserFields()}).then(apiResponse => {
                if (!apiResponse.isError()) {
                    const data = apiResponse.getData();
                    if (!_.find(data.roles, {slug: 'administrator'})) {
                        return this.onLogout();
                    }
                    return Webiny.Model.set('User', data);
                }
                return this.onLogout();
            });
        }, 5000);
    }
}

export default Authentication;