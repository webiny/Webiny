module.exports = (config) => {
    config.entry['vendor'] = [
        'jquery',
        'bootstrap-sass',
        'bluebird',
        'react',
        'react-dom',
        'react-dom/server',
        'react-addons-transition-group',
        //'react-css-modules',
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
        './Webiny',

        /*'draft-js',
        'bootstrap-daterangepicker',
        'clipboard',
        'accounting',
        'cropperjs',
        'dynamics.js',
        'eonasdan-bootstrap-datetimepicker',
        'highlight.js',
        'pluralize',
        'owl.carousel',
        'quill',
        'select2',
        'simplemde',
        'codemirror',
        'blueimp-md5',
        'filesize',
        'c3',
        'localforage',*/
    ];

    return config;
};
