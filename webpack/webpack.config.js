const loaders = require('./loaders');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
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

const config = {
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
    devtool: devBuild ? 'cheap-eval-source-map' : 'source-map',
    plugins: [
        new CopyWebpackPlugin([
            { from: 'src/api', to: 'api' },
            { from: 'src/img', to: 'img' },
            { from: 'src/all-locations.db', to: '.' },
            { from: 'src/.htaccess', to: '.' },
            { from: 'src/favicon.ico', to: '.' },
            { from: 'src/init.php', to: '.' }
        ]),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body',
            hash: true
        }),
        new webpack.ProvidePlugin({
        }),
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({
            'process.env': { // Short-circuits all vue.js warning code in "production" builds
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        })
    ],
    module: {
        rules: loaders
    }
};

if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false
                }
            },
            parallel: true
        })
    );
}

module.exports = config;