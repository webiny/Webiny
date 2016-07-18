import Webiny from 'Webiny';
import Container from './Container';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Tags = Container;
    }
}

export default Module;
