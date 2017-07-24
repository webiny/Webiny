import Webiny from 'Webiny';
import Forbidden from 'Webiny/Ui/Views/Auth/Forbidden';
import Login from 'Webiny/Ui/Views/Auth/Login';

class Auth extends Webiny.Base.Auth {
    renderLogin() {
        return Login;
    }

    renderForbidden() {
        return Forbidden;
    }
}

export default Auth;