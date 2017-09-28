import Webiny from 'webiny';
import 'Webiny/Ui/Assets/styles.scss';
import registerComponents from './Components';
import registerVendors from './Vendors';

class Ui extends Webiny.App {
    constructor() {
        super('Webiny.Ui');
        registerComponents();
        registerVendors();
        console.timeStamp('App run: Webiny.Ui');
    }
}

Webiny.registerApp(new Ui());