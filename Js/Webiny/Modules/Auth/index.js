import Webiny from 'Webiny';
import Auth from './Auth';

class Module extends Webiny.Module {

    init() {
        Webiny.Base.Auth = Auth;
    }
}

export default Module;
