import Webiny from 'Webiny';
import ListContainer from './ListContainer';

class Module extends Webiny.Module {

    constructor(app) {
        super(app);
        Webiny.Ui.Components.ListContainer = ListContainer;
        Webiny.Ui.Components.List = {

        };
    }
}

export default Module;
