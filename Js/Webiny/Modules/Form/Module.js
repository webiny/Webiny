import Webiny from 'Webiny';
import Container from './FormContainer';
import Error from './FormContainerError';
import Fieldset from './Fieldset';
import DelayedValueLink from './DelayedValueLink';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Form = {Container, Fieldset, Error};
        Webiny.Ui.Components.DelayedValueLink = DelayedValueLink;
    }
}

export default Module;
