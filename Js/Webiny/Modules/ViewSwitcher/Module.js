import Webiny from 'Webiny';
import ViewSwitcher from './ViewSwitcher';
import View from './ViewSwitcherView';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.ViewSwitcher = ViewSwitcher;
        ViewSwitcher.View = View;
    }
}

export default Module;
