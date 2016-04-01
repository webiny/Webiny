import Webiny from 'Webiny';
import Icon from './Icon';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Icon = Icon;
    }
}

export default Module;
