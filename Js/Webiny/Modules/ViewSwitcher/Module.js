import Webiny from 'Webiny';
import Container from './ViewSwitcherContainer';
import View from './ViewSwitcherView';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.ViewSwitcher = {Container, View};
    }
}

export default Module;
