const path = require('path')
const webpack = require('webpack')
const glob = require('glob')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const AutoPreFixer = require('autoprefixer')
const projectRoot = path.resolve(__dirname, '../')
const SRC = path.resolve(projectRoot, 'src')
const JS_SRC = path.resolve(SRC, 'js')

const REG_JS = new RegExp(`${SRC}/js/(.+).js`)
const getWebpackConfig = () => {
  const jsFiles = glob.sync(`${SRC}/js/**/*.bundle.js`)
  const entry = {}

  jsFiles.forEach(file => {
    const key = file.replace(REG_JS, '$1')
    entry[key] = [file]
  })

  entry['vendor'] = ['@babel/polyfill']
  entry['style'] = [path.resolve(projectRoot, `src/css/style.scss`)]

  return { entry }
}

module.exports = () => {
  return Object.assign(getWebpackConfig(), {
    output: {
      path: path.resolve(projectRoot, 'dist/assets'),
      publicPath: path.resolve(projectRoot, 'dist/assets'),
      filename: 'js/[name].js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              babelrc: true,
              extends: path.resolve(projectRoot, '.babelrc')
            }
          }
        },
        {
          test: /\.s?[ac]ss$/,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  AutoPreFixer({
                    browsers: ['IE 10', 'IE 11', 'last 3 versions'],
                    grid: true
                  })
                ]
              }
            },
            'sass-loader'
          ]
        },
      ]
    },
    resolve: {
      extensions: ['.js'],
      modules: [JS_SRC, 'node_modules'],
      alias: { '@': JS_SRC }
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
      new MiniCssExtractPlugin({
        filename: 'css/[name].css'
      })
    ],
    stats: 'none'
  })
}
