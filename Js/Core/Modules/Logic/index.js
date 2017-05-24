import Webiny from 'Webiny';
import Switch from './Switch';
import Show from './Show';
import Hide from './Hide';

class Module extends Webiny.Module {

    init() {
        this.name = 'Logic';
        Webiny.Ui.Components.Logic = {
            Show,
            Hide,
            Switch
        };
    }
}

export default Module;
