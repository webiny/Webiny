import Webiny from 'Webiny';
import 'Assets/styles.scss';
import registerComponents from './Ui/Components';
import registerVendors from './Vendors';

class Components extends Webiny.App {
    constructor() {
        super('Webiny.Components');
        registerComponents();
        registerVendors();
        console.timeStamp('App run: Webiny.Components');
    }
}

Webiny.registerApp(new Components());