import Webiny from 'Webiny';
import Settings from './Settings';

class Module extends Webiny.Module {

    init() {
        this.name = 'Settings';
        Webiny.Ui.Components.Settings = Settings;
    }
}

export default Module;
