import Webiny from 'Webiny';
import Row from './Row';
import Col from './Col';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Grid = {Row, Col};
    }
}

export default Module;
