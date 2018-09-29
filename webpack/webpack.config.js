const loaders = require('./loaders');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackAutoInject = require('webpack-auto-inject-version');
const webpack = require('webpack');

const devBuild = process.env.NODE_ENV === 'dev';
console.log(`Starting webpack build with NODE_ENV: ${process.env.NODE_ENV}`);

const config = {
    entry: {
        main: [ path.resolve('./src/app/app.ts') ]
    },
    output: {
        publicPath: './',
        // path: path.resolve('../../../build/resources/main/static/'),
        path: path.resolve('./dist/'),
        filename: '[name].js'
    },
    resolve: {
        extensions: [ '.ts', '.tsx', '.js', '.json', '.svg' ],
        modules: [ 'src/app', 'src/img', 'src/css', 'node_modules' ]
    },
    mode: devBuild ? 'development' : 'production',
    devtool: devBuild ? 'cheap-eval-source-map' : 'source-map',
    plugins: [
        new VueLoaderPlugin(),
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
        }),
        new WebpackAutoInject({
            components: {
                AutoIncreaseVersion: false,
                InjectAsComment: false,
                InjectByTag: true
            },
            componentsOptions: {
                InjectByTag: {
                    fileRegex: /^.*\.js$/,
                    dateFormat: 'mmmm d, yyyy'
                }
            }
        })
    ],
    module: {
        rules: loaders
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                // Create a separate chunk for everything in node_modules
                vendor: {
                    test: /node_modules/,
                    name: 'vendor',
                    enforce: true,
                    chunks: 'all'
                }
            }
        }
    }
};

module.exports = config;
