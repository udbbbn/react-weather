const webpack = require('webpack');
const config = require('./webpack.common.config');
config.devServer = {
    host: '127.0.0.1',
    port: 8080,
    hot: true,
    publicPath: '/dist/'
}
config.devtool= "source-map";
config.mode = 'development';
config.module.rules.push(
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
    });
config.plugins.push(new webpack.HotModuleReplacementPlugin());
module.exports = config;