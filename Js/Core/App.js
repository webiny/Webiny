import Webiny from 'Webiny';
import Logger from './Logger';

class Core extends Webiny.App {
    constructor() {
        super('Webiny.Core');
        Webiny.Logger = new Logger();
        console.timeStamp('App run: Webiny.Core');
    }
}

Webiny.registerApp(new Core());