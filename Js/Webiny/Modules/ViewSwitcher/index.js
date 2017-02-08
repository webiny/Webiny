import Webiny from 'Webiny';
import ViewSwitcher from './ViewSwitcher';
import View from './ViewSwitcherView';

class Module extends Webiny.Module {

    init() {
        this.name = 'ViewSwitcher';
        Webiny.Ui.Components.ViewSwitcher = ViewSwitcher;
        ViewSwitcher.View = View;
    }
}

export default Module;
