const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')

module.exports = () => {
  return webpackMerge(baseConfig(), {
    mode: 'development',
    devtool: 'eval'
  })
}
