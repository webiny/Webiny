import Webiny from 'Webiny';
import Container from './FormContainer';
import Error from './FormContainerError';
import Loader from './FormContainerLoader';
import Fieldset from './Fieldset';
import DelayedOnChange from './DelayedOnChange';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Form = Container;
        Webiny.Ui.Components.DelayedOnChange = DelayedOnChange;
        _.assign(Webiny.Ui.Components.Form, {Fieldset, Error, Loader});
    }
}

export default Module;