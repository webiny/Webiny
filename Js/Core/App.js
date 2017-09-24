import Webiny from 'webiny';

import Logger from './Logger';
import ClientStorage from './Lib/ClientStorage';
import Store from './Lib/ClientStorage/Store';
import LocalForage from './Lib/ClientStorage/LocalForage';
import appendLibrary from './Lib';
import App from './Lib/Core/App';

class Core extends App {
    constructor() {
        super('Webiny.Core');
        appendLibrary(Webiny);
        Webiny.Logger = new Logger();
        Webiny.LocalStorage = new ClientStorage(new Store());
        Webiny.IndexedDB = new ClientStorage(new LocalForage());

        Webiny.I18n.init();
        console.timeStamp('App run: Webiny.Core');
    }
}

Webiny.registerApp(new Core());