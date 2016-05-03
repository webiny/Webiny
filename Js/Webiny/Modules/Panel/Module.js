import Webiny from 'Webiny';
import Body from './Body';
import Header from './Header';
import Footer from './Footer';
import Panel from './Panel';
import Menu from './Menu';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Panel = {Panel, Header, Body, Footer, Menu};
    }
}

export default Module;
