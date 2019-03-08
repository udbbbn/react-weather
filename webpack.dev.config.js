const path = require("path");
const webpack = require('webpack');
const config = require('./webpack.common.config');
const merge = require('webpack-merge');
module.exports = merge(config, {
    devtool: "source-map",
    mode: 'development',
    devServer: {
        host: '127.0.0.1',
        port: 8080,
        hot: true,
        publicPath: '/dist/'
    },
    module: {
        rules: [
            {
                test: /(\.less)$/,
                exclude: /node_modules|antd\.less/,
                include:path.resolve('src/'),
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "less-loader",
                        options: {
                            javascriptEnabled: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
});

