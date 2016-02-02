import Webiny from 'Webiny';
import {Tabs, Tab} from './Tabs';

class Module extends Webiny.Module {

    constructor(app) {
        super(app);
        Webiny.Ui.Components.Tabs = {Tabs, Tab};
    }
}

export default Module;
