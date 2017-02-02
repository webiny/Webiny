import Webiny from 'Webiny';
import Authentication from './Authentication';
import Login from './Views/Login';

class Module extends Webiny.Module {

    init() {
        Webiny.Modules.Authentication = Authentication;
        Webiny.Ui.Views.Login = Login;
    }
}

export default Module;
