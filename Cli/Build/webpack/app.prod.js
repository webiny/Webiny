const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackChunkHash = require('webpack-chunk-hash');

// Custom libs
const AssetsPlugin = require('./plugins/Assets');
const i18nPlugin = require('./plugins/i18n');
const ChunkIdsPlugin = require('./plugins/ChunkIds');
const Webiny = require('webiny/lib/webiny');
let externals = require('./externals');

module.exports = function (app, config) {
    const sharedResolve = require('./resolve')(app);
    const name = app.getName();
    const context = Webiny.projectRoot(app.getSourceDir());
    const outputPath = path.resolve(Webiny.projectRoot(), 'public_html/build/production', app.getPath());

    const i18nPluginInstance = new i18nPlugin();
    const assetsPlugin = new AssetsPlugin({
        assetRules: config.assetRules,
        manifestVariable: 'window["webinyMeta"]["' + name + '"].chunks'
    });

    let plugins = [
        // Generate custom chunk ids and names
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
        // This is required to base the file hashes on file contents (to allow long term caching)
        new WebpackChunkHash({additionalHashContent: chunk => chunk.id}),
        new ExtractTextPlugin('app-[contenthash].css'),
        // Parse i18n strings and generate external file with translations
        i18nPluginInstance,
        // Generate meta.json to use for app bootstrap based on generated assets
        assetsPlugin,
        new webpack.optimize.UglifyJsPlugin({mangle: true, sourceMap: false}),
        new webpack.optimize.OccurrenceOrderPlugin()
    ];

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
            filename: '[name]-[chunkhash:10][webinyhash].js',
            chunkFilename: 'chunks/[chunkhash:10].js',
            publicPath: '' // In production builds we do not use public path. All asset paths are built into the bundles.
        },
        externals: name === 'Webiny.Core' ? {} : externals,
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
                                    require.resolve('babel-preset-es2016'),
                                    require.resolve('babel-preset-es2015'),
                                    require.resolve('babel-preset-react')
                                ],
                                plugins: [
                                    require.resolve('babel-plugin-transform-async-to-generator'),
                                    [require.resolve('babel-plugin-transform-object-rest-spread'), {'useBuiltIns': true}],
                                    [require.resolve('babel-plugin-syntax-dynamic-import')],
                                    [require.resolve('babel-plugin-transform-builtin-extend'), {
                                        globals: ['Error']
                                    }]
                                ]
                            }
                        },
                        i18nPluginInstance.getLoader()
                    ]
                },
                {
                    test: /\.scss$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: ['css-loader', 'resolve-url-loader', 'sass-loader?sourceMap']
                    })
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: app.getPath() + '_[folder]_[local]'
                        }
                    }]
                },
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
                    options: {
                        context: path.resolve(Webiny.projectRoot(), app.getSourceDir(), 'Assets'),
                        name: '[path][name].[ext]',
                        publicPath: (file) => {
                            return assetsPlugin.generateUrl(file, app.getPath());
                        }
                    }
                },
                {
                    test: fileExtensionRegex,
                    exclude: [
                        /node_modules/,
                        /\/public\//
                    ],
                    loader: 'file-loader',
                    options: {
                        context: path.resolve(Webiny.projectRoot(), app.getSourceDir(), 'Assets'),
                        name: '[path][name]-[hash].[ext]',
                        publicPath: (file) => {
                            return assetsPlugin.generateUrl(file, app.getPath());
                        }
                    }
                }
            ]
        },
        resolve: sharedResolve,
        resolveLoader: {
            modules: [
                __dirname + '/loaders',
                'node_modules',
                path.resolve(Webiny.projectRoot(), 'Apps/Webiny/node_modules')
            ]
        }
    };
};
 