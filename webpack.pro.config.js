const path = require("path");
const webpack = require('webpack');
const config = require('./webpack.common.config');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// const UglifyJsPlugin=require('uglifyjs-webpack-plugin');
// webpack4 自动压缩

module.exports = merge(config, {
    entry: {
        main: [
            __dirname + '/src/index.tsx',
        ],
        // antd按需加载跟vendor冲突
        // vendor: [
        //     "react",
        //     "react-dom",
        //     "redux",
        //     "antd"
        // ]
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        'redux': 'Redux'
    },
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
            filename: '[name].[hash:8].css' // 配置提取出来的css名称
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
        // bundle 可视化工具
        new BundleAnalyzerPlugin(
                   {
                      analyzerMode: 'server',
                      analyzerHost: '127.0.0.1',
                      analyzerPort: 8889,
                      reportFilename: 'report.html',
                      defaultSizes: 'parsed',
                      openAnalyzer: true,
                      generateStatsFile: false,
                      statsFilename: 'stats.json',
                      statsOptions: null,
                      logLevel: 'info'
                        }
               ),
        // new UglifyJsPlugin()
    ],
    // 提取公共模块
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all"
                }
            }
        },
        // 该模块只支持es5 webpack4 默认pro模式开启压缩
        // minimizer: [
        //     new UglifyJsPlugin({
        //         uglifyOptions: {
        //             compress: false,
        //             beautify: false, // 保留制表符
        //             comments: false // 保留注释
        //         }
        //     })
        // ]
    }
})

