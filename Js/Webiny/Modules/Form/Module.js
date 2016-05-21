import Webiny from 'Webiny';
import Container from './FormContainer';
import Error from './FormContainerError';
import Loader from './FormContainerLoader';
import Fieldset from './Fieldset';
import DelayedValueLink from './DelayedValueLink';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Form = {Container, Fieldset, Error, Loader};
        Webiny.Ui.Components.DelayedValueLink = DelayedValueLink;
    }
}

export default Module;