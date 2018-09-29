module.exports = [
    {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'ts-loader',
                options: {
                    // Needed for <script lang="ts"> to work in *.vue files; see https://github.com/vuejs/vue-loader/issues/109
                    appendTsSuffixTo: [ /\.vue$/ ]
                }
            },
            {
                loader: 'tslint-loader'
                // Enabling the typeCheck option here causes builds to fail:
                // "Ensure that the files supplied to lint have a .ts, .tsx, .d.ts, .js or .jsx extension."
                // Commented out like this, the build runs, but all lines of *.vue files are linted, including
                // <template> and <script> blocks.
                // , options: {
                //     typeCheck: true
                // }
            }
        ]
    }, {
        test: /\.vue$/,
        use: [
            {
                loader: 'vue-loader'
            }
        ]
    }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
    }, {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader'
    }, {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
    }, {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader'
    }, {
        test: /\.(?:html|php)$/,
        exclude: /node_modules/,
        loader: 'raw-loader'
    }, {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
    }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
    }, {
        test: /\.jpg$/,
        exclude: /node_modules/,
        loader: 'file-loader'
    }, {
        test: /\.png$/,
        exclude: /node_modules/,
        loader: 'url-loader'
    }
];
