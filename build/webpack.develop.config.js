const webpack = require('webpack'),
    webpackMerge = require('webpack-merge'),
    baseConfig = require('./webpack.base.config')

module.exports = () => {
  return webpackMerge(baseConfig(), {
    mode: 'development',
    devtool: 'eval',
  })
}
