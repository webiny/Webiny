import Webiny from 'Webiny';
import 'Assets/styles.scss';
import './Lib';
import registerComponents from './Ui/Components';
import registerVendors from './Vendors';
import Logger from './Lib/Core/Logger';
import ModuleLoader from './Lib/Core/ModuleLoader';
import DepsScanner from './Lib/Core/DepsScanner';

class Core extends Webiny.App {
    constructor() {
        super('Webiny.Core');
        Webiny.ModuleLoader = new ModuleLoader();
        Webiny.Logger = new Logger();
        Webiny.Scanner = new DepsScanner();
        registerComponents();
        registerVendors();
        console.timeStamp('App run: Webiny.Core');
    }
}

Webiny.registerApp(new Core());