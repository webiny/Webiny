import Webiny from 'Webiny';
import View from './View';
import Body from './Body';
import Header from './Header';
import Footer from './Footer';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.View = View;
        View.Header = Header;
        View.Body = Body;
        View.Footer = Footer;
    }
}

export default Module;
