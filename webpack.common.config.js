var path = require("path");
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: "./src/index.tsx",
    output: {
        path: __dirname + '/dist',
        publicPath: "dist/",
        filename: "bundle.js",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            "@": path.resolve(__dirname, 'src')
        }
    },
    module: {
        rules: [
            { 
                test: /\.tsx?$/,
                loader: "ts-loader" 
            },
            // {
            //     test: /(\.less)$/,
            //     exclude: /node_modules|antd\.less/,
            //     include:path.resolve('src/'),
            //     use: [
            //         {
            //             loader: "style-loader"
            //         },
            //         {
            //             loader: "css-loader"
            //         },
            //         {
            //             loader: "less-loader",
            //             options: {
            //                 javascriptEnabled: true
            //             }
            //         }
            //     ]
            // },
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
            {
                test: /(\.less|\.css)$/,
                include: /node_modules|antd\.less/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true
                        }
                    }
                ]
            },
            // {
            //     enforce: "pre",
            //     test: /\.js$/,
            //     loader: "source-map-loader"
            // }
        ]
    },
    plugins: [
        new ExtractTextPlugin({ //
            filename: '[name].min.css' // 配置提取出来的css名称
        })
        // new webpack.WatchIgnorePlugin([/css\.d\.ts$/])
    ],
}