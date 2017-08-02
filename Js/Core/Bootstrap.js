(function (global) {
    // import Core vendors
    require('console-polyfill');
    console.timeStamp('Bootstrap started');
    const Webiny = require('webiny').default;
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
    if (!global.webinyConfig) {
        console.error('You must define a "webinyConfig" to bootstrap your app!');
    } else {
        Webiny.run(global.webinyConfig);
    }
})(window);