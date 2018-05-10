const path = require('path'),
    webpack = require('webpack'),
    glob = require('glob'),
    projectRoot = path.resolve(__dirname, '../')

const SRC = path.resolve(projectRoot, 'src/js')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const getWebpackConfig = () => {
  const REG_SRC = new RegExp(`${SRC}/(.+).js`),
      files = glob.sync(`${SRC}/**/*.bundle.js`),
      entry = {}

  files.forEach((file) => {
    const key = file.replace(REG_SRC, '$1')
    entry[key] = [file]
  })

  entry['vendor'] = [
    'babel-polyfill',
  ]

  return {entry}
}

module.exports = () => {
  return Object.assign(getWebpackConfig(), {
    output: {
      path: path.resolve(__dirname, '../dist/assets/js'),
      publicPath: '../dist',
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js'],
      modules: [
        path.resolve(SRC),
        'node_modules',
      ],
      alias: {
        '@': SRC,
      },
    },
    externals: {
      $: 'jquery',
      jQuery: 'jquery',
    },
    optimization: {
      splitChunks: {
        minChunks: 2,
        cacheGroups: {
          vendor: {
            name: 'vendor',
            chunks: 'initial',
          },
        },
      },
    },
    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new FriendlyErrorsWebpackPlugin(),
    ],
    stats: 'none'
  })
}
