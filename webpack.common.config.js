var path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: "./src/index.tsx",
    output: {
        path: __dirname + '/dist',
        filename: "bundle.js",
    },
    devtool: "source-map",
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
            {
                test: /(\.less)$/,
                exclude: /node_modules|antd\.less/,
                include:path.resolve('src/'),
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        // loader: "css-loader",
                        // options: {
                        //     // scoped作用
                        //     modules: true,
                        //     importLoaders: 1,
                        //     localIdentName: "[local]_[hash:base64:8]"
                        // }
                        loader: 'typings-for-css-modules-loader',
                        options: {
                            modules: true,
                            namedExport: true,
                            camelCase: true,
                            minimize: true,
                            localIdentName: "[local]_[hash:base64:5]"
                        }
                    },
                    {
                        loader: "less-loader",
                        options: {
                            javascriptEnabled: true
                        }
                    }
                ]
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
            }
            // {
            //     enforce: "pre",
            //     test: /\.js$/,
            //     loader: "source-map-loader"
            // }
        ]
    },
    plugins: [
        new webpack.WatchIgnorePlugin([/css\.d\.ts$/])
    ],
}