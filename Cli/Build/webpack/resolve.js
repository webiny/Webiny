const path = require('path');
const Webiny = require('webiny/lib/webiny');

module.exports = (app) => {
    const aliases = {
        'Webiny/Core': path.resolve(Webiny.projectRoot(), 'Apps/Webiny/Js/Core'),
        'Webiny/Backend': path.resolve(Webiny.projectRoot(), 'Apps/Webiny/Js/Backend'),
        'Webiny/Skeleton': path.resolve(Webiny.projectRoot(), 'Apps/Webiny/Js/Skeleton'),
        'Webiny/Ui': path.resolve(Webiny.projectRoot(), 'Apps/Webiny/Js/Ui'),
        'Webiny': path.resolve(Webiny.projectRoot(), 'Apps/Webiny/Js/Core/Webiny.js')
    };

    // Add an alias for the app being built so we can easily point to the desired folders
    const appName = app.getAppName();
    if (appName !== 'Webiny') {
        aliases[appName] = path.resolve(Webiny.projectRoot(), 'Apps', appName, 'Js');
    }

    return {
        alias: aliases,
        extensions: ['.jsx', '.js', '.css', '.scss'],
        modules: [
            // We can resolve using app root (eg: Apps/YourApp/node_modules)
            path.resolve(Webiny.projectRoot(), 'Apps', appName, 'node_modules'),
            // We can resolve using JS app root (eg: Apps/YourApp/Js/Backend)
            path.resolve(Webiny.projectRoot(), app.getSourceDir()),
            // We can resolve using Webiny.Core (which is the core of the system)
            path.resolve(Webiny.projectRoot(), 'Apps/Webiny/node_modules'),
            // We can resolve using our project root
            path.resolve(Webiny.projectRoot(), './node_modules')
        ]
    }
};