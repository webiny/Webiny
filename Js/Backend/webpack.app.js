const Webiny = require('webiny/lib/webiny');
const ChunkBundlerPlugin = require(Webiny.projectRoot('Apps/Webiny/Cli/Build/webpack/plugins/ChunkBundlerPlugin'));

module.exports = (config) => {
    const bundle = new ChunkBundlerPlugin({
        '/admin/acl/users': [
            'Webiny/Backend/Components/UserRoles',
            'Webiny/Backend/Components/UserPermissions'
        ]
    });

    config.plugins.push(bundle);

    return config;
};
