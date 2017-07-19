(function (global) {
    // import Core vendors
    console.timeStamp('Bootstrap started');
    const Webiny = require('Webiny').default;
    const jquery = require('jquery');
    const Promise = require('bluebird');

    global.Promise = Promise;
    global.$ = global.jQuery = jquery;
    Promise.config({
        cancellation: true,
        warnings: {
            wForgottenReturn: false
        }
    });

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