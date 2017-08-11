import Webiny from 'webiny';
import Footer from './Footer';

class Layout extends Webiny.App.Module {

    init() {
        this.name = 'Layout';
        this.registerDefaultComponents({Footer});
    }
}

export default Layout;