import Webiny from 'Webiny';
import Icon from './Icon';
import Picker from './Picker';

class Module extends Webiny.Module {

    init() {
        this.name = 'Icon';
        Webiny.Ui.Components.Icon = Icon;
        Webiny.Ui.Components.Icon.Picker = Picker;
    }
}

export default Module;
