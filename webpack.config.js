const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    cache: true,
    entry: './src/index.js',
    externals: {},
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'bundle.js'
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './src/static/index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    useBuiltIns: 'usage',
                                    corejs: 3
                                }
                            ],
                            '@babel/preset-react'
                        ]
                    }
                }
            }
        ]
    },
    resolve: {
        fallback: {
            path: false,
            fs: false
        }
    }
};
