import Webiny from 'Webiny';
import Switch from 'Switch';
import Show from 'Show';
import Hide from 'Hide';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Logic = {
            Show,
            Hide,
            Switch
        };
    }
}

export default Module;
