import Webiny from 'Webiny';
import Container from './Container';
import Form from './Form';
import Renderer from './Renderer';

class Module extends Webiny.Module {

    constructor(app) {
        super(app);
        _.assign(Form.defaultProps, Renderer);
        Webiny.Ui.Components.Form = {Container, Form}
    }
}

export default Module;
