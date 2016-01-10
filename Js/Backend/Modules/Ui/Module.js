import Webiny from 'Webiny';
import './Input'; // only load module (do not import anything)

class Module extends Webiny.Module {

    constructor(app) {
        super(app);

        this.name = 'Ui';
    }
}

export default Module;
