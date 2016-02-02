import Webiny from 'Webiny';
import Form from './Form';
import Renderer from './Renderer';

class Module extends Webiny.Module {

    constructor(app) {
        super(app);
        _.assign(Form.defaultProps, Renderer);
        Webiny.Ui.Components.Form = Form;
    }
}

export default Module;
