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
            // {
            //     test: /(\.less)$/,
            //     exclude: /node_modules|antd\.less/,
            //     include:path.resolve('src/'),
            //     use: ExtractTextPlugin.extract({
            //         fallback: {
            //             loader: "style-loader"
            //         },
            //         use: [
            //             {
            //                 loader: "css-loader"
            //             },
            //             {
            //                 loader: "less-loader",
            //                 options: {
            //                     javascriptEnabled: true
            //                 }
            //             }
            //         ]
            //     })
            // },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader',
                options: {
                    limit:8192,//限制打包图片的大小：
                    //如果大于或等于8192Byte，则按照相应的文件名和路径打包图片；如果小于8192Byte，则将图片转成base64格式的字符串。
                    name:'/assets/img/[name]-[hash:8].[ext]',//img:图片打包的文件夹；
                    //[name].[ext]：设定图片按照本来的文件名和扩展名打包，不用进行额外编码
                    //[hash:8]：一个项目中如果两个文件夹中的图片重名，打包图片就会被覆盖，加上hash值的前八位作为图片名，可以避免重名。
                }
            }
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

