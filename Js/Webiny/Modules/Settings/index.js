import Webiny from 'Webiny';
import Settings from './Settings';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Settings = Settings;
    }
}

export default Module;
