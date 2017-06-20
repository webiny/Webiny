(function (global) {
    // import Core vendors
    console.timeStamp('Bootstrap started');
    const Webiny = require('Webiny');
    const Promise = require('bluebird');

    global.Promise = Promise;
    Promise.config({
        cancellation: true,
        warnings: {
            wForgottenReturn: false
        }
    });

    // Define global variables
    // These are the basic requirements for the system to work and we don't want to import them all the time in every script
    global['$'] = global['jQuery'] = require('jquery');
    global['React'] = require('react');
    global['ReactDOM'] = require('react-dom');
    global['_'] = require('webiny-lodash');
    require('bootstrap-sass');

    if (DEVELOPMENT) {
        global['$Webiny'] = Webiny;
    }

    // Check if `Webiny` config exists in the global
    if (!global.Webiny) {
        console.error('You must define a "Webiny" config to bootstrap your app!');
    } else {
        Webiny.run(global.Webiny);
    }
})(window);