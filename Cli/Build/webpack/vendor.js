const path = require('path');
const webpack = require('webpack');
const Visualizer = require('webpack-visualizer-plugin');
const Webiny = require('webiny/lib/webiny');

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
                                    'es2016',
                                    ['es2015', {modules: false}],
                                    'react'
                                ],
                                plugins: [
                                    [require.resolve('babel-plugin-lodash')]
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