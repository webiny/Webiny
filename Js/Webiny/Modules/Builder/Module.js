import Webiny from 'Webiny';
import View from './View';

class Module extends Webiny.Module {

    init() {
        _.set(Webiny, 'Builder.View', View);
    }
}

export default Module;
