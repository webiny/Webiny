import Webiny from 'Webiny';
import Container from './Container';
import Fieldset from './Fieldset';
import DelayedValueLink from './DelayedValueLink';
import Error from './ContainerError';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Form = {Container, Fieldset, Error};
        Webiny.Ui.Components.DelayedValueLink = DelayedValueLink;
    }
}

export default Module;
