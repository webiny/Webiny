import Webiny from 'Webiny';
import Data from './Data';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Data = Data;
    }
}

export default Module;
