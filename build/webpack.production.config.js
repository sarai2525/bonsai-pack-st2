const webpack = require('webpack'),
    webpackMerge = require('webpack-merge'),
    baseConfig = require('./webpack.base.config')

module.exports = () => {
  return webpackMerge(baseConfig(), {
    mode: 'production',
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    ],
  })
}
