import Webiny from 'Webiny';
import Icon from './Icon';
import Picker from './Picker';

class Module extends Webiny.Module {

    init() {
        this.name = 'Icon';
        Webiny.Ui.Components.Icon = Icon;
        Webiny.Ui.Components.Icon.Picker = Picker;
        // Force webpack to build this component to be ready for dynamic import
        () => import('Webiny/Ui/Icon');
    }
}

export default Module;
