import Webiny from 'Webiny';
import Dialog from './Components/Dialog';
import Header from './Components/Header';
import Body from './Components/Body';
import Footer from './Components/Footer';
import Confirmation from './Components/Confirmation';
import Success from './Components/Success';

class Module extends Webiny.Module {

    init() {
        this.name = 'Modal';
        Webiny.Ui.Components.Modal = {
            Dialog,
            Body,
            Header,
            Footer,
            Confirmation,
            Success
        };
    }
}

export default Module;
