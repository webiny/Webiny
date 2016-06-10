import Webiny from 'Webiny';

import InfoGrowl from './Components/InfoGrowl';
import DangerGrowl from './Components/DangerGrowl';
import WarningGrowl from './Components/WarningGrowl';
import SuccessGrowl from './Components/SuccessGrowl';

function getGrowler() {
    const growler = Webiny.Ui.Dispatcher.get('GrowlContainer');
    if (!growler) {
        console.warn('Warning: "GrowlContainer" was not found in your app!');
    }

    return growler;
}

const Growler = function Growler(element) {
    const growler = getGrowler();

    if (!growler) {
        return;
    }

    growler.addGrowl(element);
};

_.assign(Growler, {
    info(message, title = 'Info', sticky = false, ttl = 3000) {
        const growler = getGrowler();

        if (!growler) {
            return;
        }

        growler.addGrowl(<InfoGrowl {...{message, title, sticky, ttl}}/>);
    },

    success(message, title = 'Success', sticky = false, ttl = 3000) {
        const growler = getGrowler();

        if (!growler) {
            return;
        }

        growler.addGrowl(<SuccessGrowl {...{message, title, sticky, ttl}}/>);
    },

    danger(message, title = 'Danger', sticky = true, ttl = 3000) {
        const growler = getGrowler();

        if (!growler) {
            return;
        }

        growler.addGrowl(<DangerGrowl {...{message, title, sticky, ttl}}/>);
    },

    warning(message, title = 'Warning', sticky = true, ttl = 3000) {
        const growler = getGrowler();

        if (!growler) {
            return;
        }

        growler.addGrowl(<WarningGrowl {...{message, title, sticky, ttl}}/>);
    }
});

export default Growler;