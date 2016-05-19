import Webiny from 'Webiny';
import Fieldset from './Components/Fieldset';
import Row from './Components/Row';
import Empty from './Components/Empty';


class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Dynamic = {
            Fieldset,
            Row,
            Empty
        };
    }
}

export default Module;
