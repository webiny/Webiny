import Webiny from 'Webiny';
import Tabs from './Tabs';
import Tab from './Tab';
import TabHeader from './TabHeader';
import TabContent from './TabContent';

class Module extends Webiny.Module {

    constructor(app) {
        super(app);
        Webiny.Ui.Components.Tabs = Tabs;
        Tab.Header = TabHeader;
        Tab.Content = TabContent;
        Tabs.Tab = Tab;
        Tab.Header = TabHeader;
        Tab.Content = TabContent;
    }
}

export default Module;
