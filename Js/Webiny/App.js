import Webiny from 'Webiny';
import 'Assets/styles.scss';
import './Lib';
import registerComponents from './Ui/Components';
import registerVendors from './Vendors';
import Logger from './Lib/Core/Logger';
import ModuleLoader from './Lib/Core/ModuleLoader';

class Core extends Webiny.App {
    constructor() {
        super('Core.Webiny');
        Webiny.ModuleLoader = new ModuleLoader();
        Webiny.Logger = new Logger();
        registerComponents();
        registerVendors();
    }
}

Webiny.registerApp(new Core());