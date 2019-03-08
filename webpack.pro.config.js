const path = require("path");
const webpack = require('webpack');
const config = require('./webpack.common.config');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(config, {
    entry: [
        __dirname + '/src/index.tsx',
    ],
    output: {
        path: __dirname + '/dist',
        publicPath: "./",
        filename: "bundle.[chunkhash].js",
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /(\.less)$/,
                exclude: /node_modules|antd\.less/,
                include:path.resolve('src/'),
                use: ExtractTextPlugin.extract({
                    fallback: {
                        loader: "style-loader"
                    },
                    use: [
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
                })
            },
        ]
    },
    plugins: [
        // new CleanWebpackPlugin(['dist'],
        // {
        //     root: __dirname,       　　　　　　　　　　//根目录
        //     verbose:  true,        　　　　　　　　　　//开启在控制台输出信息
        //     dry:      false        　　　　　　　　　　//启用删除文件
        // }),
        new ExtractTextPlugin({ //
            filename: '[name].min.css' // 配置提取出来的css名称
        }),
        // new webpack.optimize.UglifyJsPlugin(),
        new HtmlWebpackPlugin({
            inject: true,
            template: __dirname + '/public/index.html',
            filename: "index.html",
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
        }),
    ]
})

