import Webiny from 'Webiny';
import 'Assets/styles.scss';

import './Lib';
import './Ui/Components';
import './Vendors';
import Logger from './Lib/Core/Logger';

class Core extends Webiny.App {
    constructor() {
        super('Core.Webiny');
        Webiny.Logger = new Logger();
    }
}

Webiny.registerApp(new Core());