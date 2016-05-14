import Webiny from 'Webiny';
import ApiContainer from './ApiContainer';
import StaticContainer from './StaticContainer';
import Form from './Form';
import Fieldset from './Fieldset';
import DelayedValueLink from './DelayedValueLink';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Form = {ApiContainer, StaticContainer, Form, Fieldset};
        Webiny.Ui.Components.DelayedValueLink = DelayedValueLink;
    }
}

export default Module;
