(function (w) {
    System.import('Core/Webiny/webiny/webinyBootstrap').then(function (m) {
        // Check if `Webiny` function exists in the window
        if (!w.Webiny) {
            console.error('You must define a "Webiny" function to bootstrap your app!');
            return;
        }
        w.WebinyBootstrap = new m.default();
        w.Webiny(w.WebinyBootstrap.run.bind(w.WebinyBootstrap));
    });
})(window);