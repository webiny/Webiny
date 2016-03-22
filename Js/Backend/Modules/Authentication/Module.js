import Webiny from 'Webiny';
import Login from './Login';

class Authentication extends Webiny.Modules.Authentication {

    init() {
        this.registerRoutes(
            new Webiny.Route('Login', '/login', {
                MasterLayout: Login
            }).skipDefaultComponents(true)
        );
    }
}

export default Authentication;