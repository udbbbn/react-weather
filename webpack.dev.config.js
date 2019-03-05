const webpack = require('webpack');
const config = require('./webpack.common.config');
config.devServer = {
    host: '127.0.0.1',
    port: 8080,
    hot: true,
    publicPath: '/dist/'
}
config.mode = 'development';
config.plugins.push(new webpack.HotModuleReplacementPlugin());
module.exports = config;