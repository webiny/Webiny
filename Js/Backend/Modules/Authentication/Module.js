import Webiny from 'Webiny';
import Views from './Views/Views';

class Authentication extends Webiny.Modules.Authentication {

    init() {
        this.registerRoutes(
            new Webiny.Route('Login', '/login', {
                MasterLayout: Views.Login
            }).skipDefaultComponents(true)
        );
    }
}

export default Authentication;