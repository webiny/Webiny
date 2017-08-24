const Webiny = require('webiny-cli/lib/webiny');
const path = require('path');
const DllBootstrapPlugin = require('./Lib/Webpack/DllBootstrapPlugin');

module.exports = (config) => {
    config.resolve.alias['bluebird'] = 'bluebird/js/browser/bluebird.core.js';

    config.entry['vendor'] = [
        'jquery',
        'bootstrap-sass',
        'bluebird',
        'react',
        'react-dom',
        'react-transition-group',
        'classnames',
        'immutable',
        'baobab',
        'js-cookie',
        'ismobilejs',
        'history',
        'jquery-deparam',
        'platform',
        'lodash/get',
        'lodash/set',
        'lodash/has',
        'lodash/map',
        'lodash/each',
        'lodash/forEach',
        'lodash/find',
        'lodash/isArray',
        'lodash/isString',
        'lodash/isFunction',
        'lodash/isObject',
        'lodash/isPlainObject',
        'lodash/isEqual',
        'lodash/pick',
        'lodash/omit',
        'lodash/assign',
        'lodash/merge',
        'lodash/findIndex',
        'lodash/uniqueId',
        'lodash/filter',
        'lodash/noop',
        'lodash/clone',
        'lodash/cloneDeep',
        'lodash/keys',
        'lodash/values',
        'lodash/trimEnd',
        'lodash/trimStart',
        './Webiny',
        './Bootstrap'
    ];

    config.plugins.push(new DllBootstrapPlugin({module: './Bootstrap'}));

    return config;
};
