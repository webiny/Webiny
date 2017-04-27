const utils = require('webiny/lib/utils');
const path = require('path');

module.exports = (config) => {
    config.resolve.alias['webiny-lodash'] = path.resolve(utils.projectRoot(), 'Apps/Core/Js/Webiny/Vendors/Lodash');

    config.entry['vendor'] = [
        'jquery',
        'bootstrap-sass',
        'bluebird',
        'react',
        'react-dom',
        'react-dom/server',
        'react-addons-transition-group',
        'classnames',
        'immutable',
        'baobab',
        'js-cookie',
        'ismobilejs',
        'webiny-lodash',
        'moment',
        'historyjs/scripts/bundled-uncompressed/html5/native.history',
        'jquery-deparam',
        'platform',
        './Webiny'
    ];

    return config;
};
