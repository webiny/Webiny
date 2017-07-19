import Webiny from 'Webiny';
import 'Assets/styles.scss';
import registerComponents from './Ui/Components';
import registerVendors from './Vendors';
import Logger from './Lib/Core/Logger';

class Core extends Webiny.App {
    constructor() {
        super('Webiny.Core');
        Webiny.Logger = new Logger();
        registerComponents();
        registerVendors();
        console.timeStamp('App run: Webiny.Core');
    }
}

Webiny.registerApp(new Core());