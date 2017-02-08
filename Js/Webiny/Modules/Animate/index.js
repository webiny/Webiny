import Webiny from 'Webiny';
import Animate from './Animate';

class Module extends Webiny.Module {

    init() {
        this.name = 'Animate';
        Webiny.Ui.Components.Animate = Animate;
    }
}

export default Module;
