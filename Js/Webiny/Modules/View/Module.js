import Webiny from 'Webiny';
import View from './View';
import FormView from './FormView';
import ListView from './ListView';
import Body from './Body';
import Header from './Header';
import Footer from './Footer';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.View = View;
        View.Form = FormView;
        View.List = ListView;
        View.Header = Header;
        View.Body = Body;
        View.Footer = Footer;

        // Add FormView into list of components that will receive a `container` prop when used inside of Form
        const injectInto = Webiny.Ui.Components.Form.defaultProps.injectInto;
        Webiny.Ui.Components.Form.defaultProps.injectInto = () => {
            const injects = injectInto();
            injects.push(FormView);
            return injects;
        };
    }
}

export default Module;
