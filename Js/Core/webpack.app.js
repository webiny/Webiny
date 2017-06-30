const Webiny = require('webiny/lib/webiny');
const ChunkBundlerPlugin = require(Webiny.projectRoot('Apps/Webiny/Cli/Build/webpack/plugins/ChunkBundlerPlugin'));

module.exports = (config) => {
    const bundle = new ChunkBundlerPlugin({
        '*': [
            'Webiny/Core/Ui/Components/Link',
            'Webiny/Core/Ui/Components/View',
            'Webiny/Core/Ui/Components/List',
            'Webiny/Core/Ui/Components/Icon',
            'Webiny/Core/Ui/Components/Input',
            'Webiny/Core/Ui/Components/Panel',
            'Webiny/Core/Ui/Components/Grid',
            'Webiny/Core/Ui/Components/Loader',
            'Webiny/Core/Ui/Components/Form',
            'Webiny/Core/Ui/Components/Dropdown',
            'Webiny/Core/Ui/Components/DelayedOnChange',
            'Webiny/Core/Ui/Components/FormGroup',
            'Webiny/Core/Ui/Components/Animate',
            'Webiny/Core/Ui/Components/Gravatar',
            'Webiny/Core/Ui/Components/ChangeConfirm',
            'Webiny/Core/Ui/Components/Switch',
            'Webiny/Core/Ui/Components/Modal',
            'Webiny/Core/Ui/Components/Downloader',
            'Webiny/Core/Ui/Components/Button'
        ]
    });

    config.plugins.push(bundle);

    return config;
};
