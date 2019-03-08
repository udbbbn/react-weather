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
            // {
            //     enforce: "pre",
            //     test: /\.js$/,
            //     loader: "source-map-loader"
            // }
        ]
    },
    plugins: [
        // new ExtractTextPlugin({ //
        //     filename: '[name].min.css' // 配置提取出来的css名称
        // })
        // new webpack.WatchIgnorePlugin([/css\.d\.ts$/])
    ],
}