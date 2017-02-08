import Webiny from 'Webiny';
import Tabs from './Tabs';
import Tab from './Tab';
import TabHeader from './TabHeader';
import TabContent from './TabContent';

class Module extends Webiny.Module {

    init() {
        this.name = 'Tabs';
        Webiny.Ui.Components.Tabs = Tabs;
        Tabs.Tab = Tab;
        Tab.Header = TabHeader;
        Tab.Content = TabContent;
    }
}

export default Module;
