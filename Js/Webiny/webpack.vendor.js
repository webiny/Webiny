module.exports = (config) => {
    config.entry['vendor'] = [
        'jquery',
        'bootstrap-sass',
        'bluebird',
        'react',
        'react-dom',
        'react-dom/server',
        'react-addons-transition-group',
        'draft-js',
        'immutable',
        'baobab',
        'bootstrap-daterangepicker',
        'clipboard',
        'codemirror',
        'cropperjs',
        'dynamics.js',
        'eonasdan-bootstrap-datetimepicker',
        'highlight.js',
        'js-cookie',
        'lodash',
        'moment',
        'owl.carousel',
        'quill',
        'select2',
        'simplemde',
        'blueimp-md5',
        'historyjs/scripts/bundled-uncompressed/html5/native.history',
        'filesize',
        'c3',
        'jquery-deparam',
        'platform',
        './Webiny'
    ];

    return config;
};