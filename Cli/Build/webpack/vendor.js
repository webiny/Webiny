const path = require('path');
const webpack = require('webpack');
const Visualizer = require('webpack-visualizer-plugin');
const Webiny = require('webiny-cli/lib/webiny');

module.exports = function (app) {
    const sharedResolve = require('./resolve')(app);
    const name = app.getName();
    const bundleName = app.getPath();
    const context = Webiny.projectRoot(app.getSourceDir());
    const outputPath = path.resolve(Webiny.projectRoot(), 'public_html/build/' + process.env.NODE_ENV, app.getPath());

    const plugins = [
        new webpack.DefinePlugin({
            'DEVELOPMENT': process.env.NODE_ENV === 'development',
            'PRODUCTION': process.env.NODE_ENV === 'production',
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new webpack.DllPlugin({
            path: outputPath + '/[name].manifest.json',
            name: 'Webiny_' + bundleName + '_Vendor'
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new Visualizer({filename: 'vendor.html'})
    ];

    if (process.env.NODE_ENV === 'production') {
        plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                comments: false,
                mangle: true,
                sourceMap: false
            })
        );
    }

    return {
        name,
        context,
        entry: {},
        output: {
            path: outputPath,
            filename: process.env.NODE_ENV === 'production' ? '[name]-[chunkhash].js' : '[name].js',
            library: 'Webiny_' + bundleName + '_Vendor'
        },
        plugins,
        externals: name === 'Webiny.Core' ? {} : require('./externals'),
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
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
                                    [require.resolve('babel-plugin-lodash')],
                                    require.resolve('babel-plugin-transform-async-to-generator'),
                                    [require.resolve('babel-plugin-transform-object-rest-spread'), {'useBuiltIns': true}],
                                    [require.resolve('babel-plugin-syntax-dynamic-import')],
                                    [require.resolve('babel-plugin-transform-builtin-extend'), {
                                        globals: ['Error']
                                    }]
                                ]
                            }
                        }
                    ]
                }
            ]
        },
        resolve: sharedResolve
    };
};