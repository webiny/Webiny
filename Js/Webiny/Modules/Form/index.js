import Webiny from 'Webiny';
import Container from './FormContainer';
import Error from './FormContainerError';
import Loader from './FormContainerLoader';
import Section from './Section';
import DelayedOnChange from './DelayedOnChange';

class Module extends Webiny.Module {

    init() {
        this.name = 'Form';
        Webiny.Ui.Components.Form = Container;
        Webiny.Ui.Components.DelayedOnChange = DelayedOnChange;
        _.assign(Webiny.Ui.Components.Form, {Section, Error, Loader});
    }
}

export default Module;