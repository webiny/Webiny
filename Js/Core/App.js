import Webiny from 'webiny';

import Logger from './Logger';
import ClientStorage from './Lib/ClientStorage';
import Store from './Lib/ClientStorage/Store';
import LocalForage from './Lib/ClientStorage/LocalForage';
import appendLibrary from './Lib';
import App from './Lib/Core/App';
import _ from 'lodash';

class Core extends App {
    constructor() {
        super('Webiny.Core');
        appendLibrary(Webiny);
        Webiny.Logger = new Logger();
        Webiny.LocalStorage = new ClientStorage(new Store());
        Webiny.IndexedDB = new ClientStorage(new LocalForage());

        // I18n initialization
        const locale = _.get(Webiny.Config, 'I18n.locale');
        if (locale) {
            const locale = Webiny.Config.I18n.locale;
            Webiny.I18n.setLocale(locale.key).setCacheKey(locale.cacheKey).init();
        }

        console.timeStamp('App run: Webiny.Core');
    }
}

Webiny.registerApp(new Core());