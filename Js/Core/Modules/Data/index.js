import Webiny from 'Webiny';
import Data from './Data';

class Module extends Webiny.Module {

    init() {
        this.name = 'Data';
        Webiny.Ui.Components.Data = Data;
    }
}

export default Module;
