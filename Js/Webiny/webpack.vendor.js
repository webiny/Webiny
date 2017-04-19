module.exports = (config) => {
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
        'lodash',
        'moment',
        'historyjs/scripts/bundled-uncompressed/html5/native.history',
        'jquery-deparam',
        'platform',
        './Webiny'
    ];

    return config;
};
