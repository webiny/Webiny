import Webiny from 'Webiny';
import Login from './Login';

class Authentication extends Webiny.Modules.Authentication {

    init() {
        super.init();
        this.registerRoutes(
            new Webiny.Route('Login', '/login', Login, 'Login').setLayout('empty'),
            new Webiny.Route('Forbidden', '/forbidden', this.renderForbidden(), 'Forbidden')
        );
    }
}

export default Authentication;