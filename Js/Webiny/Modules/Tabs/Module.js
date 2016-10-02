import Webiny from 'Webiny';
import {Tabs, Tab} from './Tabs';

class Module extends Webiny.Module {

    constructor(app) {
        super(app);
        Webiny.Ui.Components.Tabs = Tabs;
        Tabs.Tab = Tab;
    }
}

export default Module;
