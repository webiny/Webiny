import Webiny from 'Webiny';
import FieldSet from './Components/FieldSet';
import Add from './Components/Add';
import Remove from './Components/Remove';
import Row from './Components/Row';
import Empty from './Components/Empty';


class Module extends Webiny.Module {

    constructor(app) {
        super(app);
        Webiny.Ui.Components.Dynamic = {
            FieldSet,
            Add,
            Remove,
            Row,
            Empty
        };
    }
}

export default Module;
