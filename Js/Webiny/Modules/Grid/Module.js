import Webiny from 'Webiny';
import Row from './Row';
import Col from './Col';

class Module extends Webiny.Module {

    constructor(app) {
        super(app);
        Webiny.Ui.Components.Grid = {Row, Col};
    }
}

export default Module;
