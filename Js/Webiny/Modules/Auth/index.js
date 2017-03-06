import Webiny from 'Webiny';
import Auth from './Auth';

class Module extends Webiny.Module {

    init() {
        this.name = 'Auth';
        Webiny.Base.Auth = Auth;
    }
}

export default Module;
