import Webiny from 'Webiny';
import Link from './Link';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Link = Link;
    }
}

export default Module;
