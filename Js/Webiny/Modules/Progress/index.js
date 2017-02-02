import Webiny from 'Webiny';
import Progress from './Progress';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Progress = Progress;
    }
}

export default Module;
