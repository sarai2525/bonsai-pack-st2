const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = () => {
  return webpackMerge(baseConfig(), {
    mode: 'production',
    output: {
      filename: '[name].[hash].js'
    },
    plugins: [
      new OptimizeCSSAssetsPlugin({}),
      new MiniCssExtractPlugin({
        filename: '[name].[hash].css'
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    ]
  })
}
