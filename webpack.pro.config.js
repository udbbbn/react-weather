const path = require("path");
const webpack = require('webpack');
const config = require('./webpack.common.config');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin=require('uglifyjs-webpack-plugin');

module.exports = merge(config, {
    entry: {
        main: [
            __dirname + '/src/index.tsx',
        ],
        vendor: [
            "react",
            "react-dom",
            "redux",
            "antd"
        ]
    },
    // externals: {
    //     "antd": "antd",
    //     "React": "React",
    //     "ReactDOM": "ReactDOM",
    //     'Redux': 'Redux'
    // },
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
        new CleanWebpackPlugin({
                root: path.resolve(__dirname, 'dist'),
                exclude: ['assets'],
                dry: false // 启用删除文件
        }),
        new ExtractTextPlugin({ 
            filename: '[name].min.css' // 配置提取出来的css名称
        }),
        new HtmlWebpackPlugin({
            inject: 'body',
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
        
        // new UglifyJsPlugin()
    ],
    optimization: {
        runtimeChunk: {
            name: "manifest"
        },
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all"
                }
            }
        }
    }
    //  //压缩js webpack4之后的新写法
    // optimization: {
    //     minimizer: [
    //     ]
    // }
})

