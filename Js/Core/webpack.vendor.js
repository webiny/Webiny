const utils = require('webiny/lib/utils');
const path = require('path');

module.exports = (config) => {
    config.resolve.alias['webiny-lodash'] = path.resolve(utils.projectRoot(), 'Apps/Webiny/Js/Core/Vendors/Lodash');
    config.resolve.alias['bluebird'] = 'bluebird/js/browser/bluebird.core.js';

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
