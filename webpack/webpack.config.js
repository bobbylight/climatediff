const loaders = require('./loaders');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const devBuild = process.env.NODE_ENV === 'dev';

// // Loaders specific to compiling
// loaders.push({
//     test: /\.tsx?$/,
//     enforce: 'pre',
//     loader: 'tslint-loader',
//     exclude: /node_modules/,
//     options: {
//         typeCheck: true
//     }
// });

module.exports = [{
    entry: {
        main: [ path.resolve('./src/app/app.js') ]
    },
    output: {
        publicPath: './',
        // path: path.resolve('../../../build/resources/main/static/'),
        path: path.resolve('./dist/'),
        filename: '[name].js'
    },
    resolve: {
        extensions: [ '.ts', '.tsx', '.js', '.json', '.vue', '.svg' ],
        modules: [ 'src/app', 'src/img', 'src/css', 'node_modules' ],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    devtool: 'source-map', //devBuild ? 'cheap-eval-source-map' : 'source-map',
    plugins: [
        new CopyWebpackPlugin([
            { from: 'src/api', to: 'api' },
            { from: 'src/img', to: 'img' },
            { from: 'src/all-locations.db', to: '.' },
            { from: 'src/.htaccess', to: '.' },
            { from: 'src/init.php', to: '.' }
        ]),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body',
            hash: true
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ],
    module: {
        rules: loaders
    }
}];

if (!devBuild) {
    module.exports[0].plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
}
