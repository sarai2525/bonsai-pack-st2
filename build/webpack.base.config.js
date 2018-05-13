const path = require('path')
const webpack = require('webpack')
const glob = require('glob')
const projectRoot = path.resolve(__dirname, '../')
const SRC = path.resolve(projectRoot, 'src/js')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const getWebpackConfig = () => {
  const REG_SRC = new RegExp(`${SRC}/(.+).js`)
  const files = glob.sync(`${SRC}/**/*.bundle.js`)
  const entry = {}

  files.forEach(file => {
    const key = file.replace(REG_SRC, '$1')
    entry[key] = [file]
  })

  entry['vendor'] = ['babel-polyfill', 'jquery']
  entry['style'] = [path.resolve(projectRoot, `src/css/style.scss`)]

  return { entry }
}

module.exports = () => {
  return Object.assign(getWebpackConfig(), {
    output: {
      path: path.resolve(projectRoot, 'dist'),
      filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: { loader: 'babel-loader' }
        },
        {
          test: /\.s?[ac]ss$/,
          exclude: /node_modules/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            { loader: 'css-loader' },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  require('autoprefixer')({ browsers: 'last 3 versions' })
                ]
              }
            },
            { loader: 'sass-loader' }
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.js'],
      modules: [path.resolve(SRC), 'node_modules'],
      alias: { '@': SRC }
    },
    externals: {
      $: 'jquery',
      jQuery: 'jquery'
    },
    optimization: {
      splitChunks: {
        minChunks: 2,
        cacheGroups: {
          vendor: {
            name: 'vendor',
            chunks: 'initial'
          },
          styles: {
            name: 'style',
            test: /\.css$/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    },
    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new FriendlyErrorsWebpackPlugin(),
      new MiniCssExtractPlugin()
    ],
    stats: 'none'
  })
}
