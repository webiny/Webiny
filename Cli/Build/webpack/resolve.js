const path = require('path');
const Webiny = require('webiny-cli/lib/webiny');

module.exports = (app) => {
    const aliases = {
        'webiny': path.resolve(Webiny.projectRoot(), 'Apps/Webiny/Js/Core/Webiny.js')
    };

    // Add all existing apps to aliases
    Webiny.getApps().forEach(app => {
        aliases[app.getName().replace('.', '/')] = path.resolve(Webiny.projectRoot(), app.getSourceDir());
    });

    return {
        alias: aliases,
        extensions: ['.jsx', '.js', '.css', '.scss'],
        modules: [
            // We can resolve using app root (eg: Apps/YourApp/node_modules)
            path.resolve(Webiny.projectRoot(), 'Apps', app.getAppName(), 'node_modules'),
            // We can resolve using JS app root (eg: Apps/YourApp/Js/Backend)
            path.resolve(Webiny.projectRoot(), app.getSourceDir()),
            // We can resolve using Webiny root (which is the core of the system)
            path.resolve(Webiny.projectRoot(), 'Apps/Webiny/node_modules'),
            // We can resolve using our project root
            path.resolve(Webiny.projectRoot(), './node_modules')
        ]
    }
};