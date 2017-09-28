import Webiny from 'webiny';
import Forbidden from 'Webiny/Skeleton/Views/Auth/Forbidden';
import Login from 'Webiny/Skeleton/Views/Auth/Login';

class Auth extends Webiny.Base.Auth {
    renderLogin() {
        return Login;
    }

    renderForbidden() {
        return Forbidden;
    }
}

export default Auth;