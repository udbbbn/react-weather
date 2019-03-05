const webpack = require('webpack');
const config = require('./webpack.common.config');
config.devServer = {
    hot: true,
    publicPath: '/dist/'
}
config.mode = 'development';
config.plugins.push(new webpack.HotModuleReplacementPlugin());
module.exports = config;