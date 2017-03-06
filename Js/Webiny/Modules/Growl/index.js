import Webiny from 'Webiny';
import Container from './Components/GrowlContainer';
import Growler from './Growler';

import Info from './Components/InfoGrowl';
import Success from './Components/SuccessGrowl';
import Warning from './Components/WarningGrowl';
import Danger from './Components/DangerGrowl';

class Module extends Webiny.Module {

    init() {
        this.name = 'Growl';
        Webiny.Ui.Components.Growl = {
            Container,
            Info,
            Success,
            Warning,
            Danger
        };
        Webiny.Growl = Growler;
    }
}

export default Module;
