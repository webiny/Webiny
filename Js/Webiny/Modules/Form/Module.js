import Webiny from 'Webiny';
import FormContainer from './FormContainer';
import Form from './Form';
import Renderer from './Renderer';

class Module extends Webiny.Module {

    constructor(app) {
        super(app);
        _.assign(Form.defaultProps, Renderer);
        Webiny.Ui.Components.FormContainer = FormContainer;
        Webiny.Ui.Components.Form = Form;
    }
}

export default Module;
