const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');

// Custom libs
const AssetsPlugin = require('./plugins/Assets');
const ModuleIdsPlugin = require('./plugins/ModuleIds');
const ChunkIdsPlugin = require('./plugins/ChunkIds');
const Webiny = require('webiny-cli/lib/webiny');

module.exports = function (app, config) {
    const sharedResolve = require('./resolve')(app);
    const name = app.getName();
    const context = Webiny.projectRoot(app.getSourceDir());
    const outputPath = path.resolve(Webiny.projectRoot(), 'public_html/build/production', app.getPath());

    const assetsPlugin = new AssetsPlugin({
        assetRules: config.assetRules,
        manifestVariable: 'window["webinyConfig"]["Meta"]["' + name + '"].chunks'
    });

    let plugins = [
        new ModuleIdsPlugin(),
        new ChunkIdsPlugin(),
        // Define environment and other constants
        new webpack.DefinePlugin({
            'DEVELOPMENT': false,
            'PRODUCTION': true,
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        // To generate module ids that are preserved between builds
        new webpack.HashedModuleIdsPlugin(),
        new ExtractTextPlugin('app.css'),
        // Generate meta.json to use for app bootstrap based on generated assets
        assetsPlugin,
        new webpack.optimize.UglifyJsPlugin({mangle: true, sourceMap: false}),
        new OptimizeCssAssetsPlugin({
            canPrint: false,
            assetNameRegExp: /\.css$/,
            cssProcessorOptions: {
                discardComments: {removeAll: true},
                safe: true,
                reduceInitial: {disable: true}
            }
        }),
        new Visualizer({filename: 'stats.html'})
    ];

    const stylesRule = require('./styles')(app);

    // Check if app has vendor DLL defined
    const dllPath = path.resolve(Webiny.projectRoot(), 'public_html/build/production', app.getPath(), 'vendor.manifest.json');
    if (Webiny.fileExists(dllPath)) {
        plugins.push(
            new webpack.DllReferencePlugin({
                context,
                manifest: require(dllPath)
            })
        );
    }

    if (name !== 'Webiny.Core') {
        plugins.push(
            new webpack.DllReferencePlugin({
                context: Webiny.projectRoot('Apps/Webiny/Js/Core'),
                manifest: Webiny.projectRoot('public_html/build/production') + '/Webiny_Core/vendor.manifest.json'
            })
        );
    }

    function fileLoaderOptions(name) {
        return {
            name,
            context: path.resolve(Webiny.projectRoot(), app.getSourceDir(), 'Assets'),
            publicPath: (file) => {
                return assetsPlugin.generateUrl(file, app.getPath());
            },
            outputPath: (file) => {
                if (file.startsWith('_/')) {
                    const parts = file.replace(/_\//g, '').split('/Assets/');
                    file = path.join('external', parts[0], parts[1]);
                }
                return file;
            }
        }
    }

    const fileExtensionRegex = /\.(png|jpg|gif|jpeg|mp4|mp3|woff2?|ttf|otf|eot|svg|ico)$/;

    return {
        name: name,
        cache: true,
        watch: false,
        devtool: 'cheap-module-source-map',
        context,
        entry: {
            app: ['./App.js']
        },
        output: {
            path: outputPath,
            filename: 'app.js',
            chunkFilename: 'chunks/[name].js',
            jsonpFunction: 'webpackJsonp' + app.getName().replace('.', ''),
            publicPath: '' // In production builds we do not use public path. All asset paths are built into the bundles.
        },
        externals: name === 'Webiny.Core' ? {} : require('./externals'),
        plugins,
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    include: Webiny.projectRoot(),
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    [require.resolve('babel-preset-es2015')],
                                    require.resolve('babel-preset-react')
                                ],
                                plugins: [
                                    require.resolve('babel-plugin-transform-async-to-generator'),
                                    [require.resolve('babel-plugin-transform-object-rest-spread'), {'useBuiltIns': true}],
                                    [require.resolve('babel-plugin-syntax-dynamic-import')],
                                    [require.resolve('babel-plugin-lodash')],
                                    [require.resolve('babel-plugin-transform-builtin-extend'), {globals: ['Error']}],
                                    // This plugin is required to force all css/scss imports to have a resourceQuery
                                    [require.resolve('babel-plugin-transform-rename-import'), {
                                        original: '^(.*?\.s?css)$', replacement: '$1?',
                                    }]
                                ]
                            }
                        }
                    ]
                },
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    include: Webiny.projectRoot(),
                    use: 'i18n-loader'
                },
                stylesRule,
                {
                    test: /node_modules/,
                    include: fileExtensionRegex,
                    loader: 'file-loader',
                    options: {
                        context: path.resolve(Webiny.projectRoot(), 'Apps', app.getAppName(), 'node_modules'),
                        name: 'external/[path][name]-[hash].[ext]',
                        publicPath: (file) => {
                            return assetsPlugin.generateUrl(file, app.getPath());
                        }
                    }
                },
                // Files containing /public/ should not include [hash]
                // This is for rare occasions when we need to include a path to the file in TPL template
                {
                    test: fileExtensionRegex,
                    exclude: /node_modules/,
                    include: /\/public\//,
                    loader: 'file-loader',
                    options: fileLoaderOptions('[path][name].[ext]')
                },
                {
                    test: fileExtensionRegex,
                    exclude: [
                        /node_modules/,
                        /\/public\//
                    ],
                    loader: 'file-loader',
                    options: fileLoaderOptions('[path][name]-[hash].[ext]')
                }
            ]
        },
        resolve: sharedResolve,
        resolveLoader: {
            modules: [
                __dirname + '/loaders',
                'node_modules',
                path.resolve(Webiny.projectRoot(), 'Apps/Webiny/node_modules'),
                path.resolve(Webiny.projectRoot(), 'Apps/' + app.getAppName() + '/node_modules'),
            ]
        }
    };
};
 