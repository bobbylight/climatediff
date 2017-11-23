const loaders = require('./loaders');
const path = require('path');
const webpack = require('webpack');

// loaders.push({
//     test: /\.ts$/,
//     loader: 'istanbul-instrumenter-loader',
//     exclude: [
//         /node_modules/,
//         /\.spec\.ts$/
//     ]
// });

module.exports = {
    entry: {
        main: [ path.resolve('./src/app/index.js') ]
    },
    output: {
        filename: 'build.js',
        // path: 'tmp'
    },
    resolve: {
        extensions: [ '.ts', '.tsx', '.js', '.json' ],
        modules: [ 'src/app', 'src/styles', 'node_modules' ]
    },
    // devtool: "inline-source-map",
    // plugins: [
    //     new webpack.ProvidePlugin({})
    // ],
    module: {
        loaders: loaders
    }
};
