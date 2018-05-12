const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = () => {
  return webpackMerge(baseConfig(), {
    mode: 'production',
    plugins: [
      new OptimizeCSSAssetsPlugin({}),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    ]
  })
}
