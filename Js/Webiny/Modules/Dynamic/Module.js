import Webiny from 'Webiny';
import FieldSet from './Components/FieldSet';
import Row from './Components/Row';
import Empty from './Components/Empty';


class Module extends Webiny.Module {

    constructor(app) {
        super(app);
        Webiny.Ui.Components.Dynamic = {
            FieldSet,
            Row,
            Empty
        };
    }
}

export default Module;
