import Webiny from 'webiny';
import Logger from './Logger';
import appendLibrary from './Lib';
import App from './Lib/Core/App';

class Core extends App {
    constructor() {
        super('Webiny.Core');
        appendLibrary(Webiny);
        Webiny.Logger = new Logger();
        console.timeStamp('App run: Webiny.Core');
    }
}

Webiny.registerApp(new Core());