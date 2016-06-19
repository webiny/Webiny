import Webiny from 'Webiny';
import Container from './Container';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.CodeEditor = Container;
    }
}

export default Module;
