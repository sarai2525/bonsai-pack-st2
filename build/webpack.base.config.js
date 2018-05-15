const path = require('path')
const webpack = require('webpack')
const glob = require('glob')
const projectRoot = path.resolve(__dirname, '../')
const SRC = path.resolve(projectRoot, 'src')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const AutoPreFixer = require('autoprefixer')

const getWebpackConfig = () => {
  const REG_JS = new RegExp(`${SRC}/js/(.+).js`)
  const REG_IMG = new RegExp(`${SRC}/img/.(png|jpe?g|gif)`)
  const REG_MOV = new RegExp(`${SRC}/fonts/.(mp4|mov)`)
  const REG_FONTS = new RegExp(`${SRC}/fonts/.(woff|woff2|eot|ttf|svg)`)

  const jsFiles = glob.sync(`${SRC}/js/**/*.bundle.js`)
  const imgFiles = glob.sync(`${SRC}/img/**/*`)
  const fontFiles = glob.sync(`${SRC}/fonts/**/*`)
  const movFiles = glob.sync(`${SRC}/movie/**/*`)
  const entry = {}

  jsFiles.forEach(file => {
    const key = file.replace(REG_JS, '$1')
    entry[key] = [file]
  })

  imgFiles.forEach(file => {
    const key = file.replace(REG_IMG, '$1')
    entry[key] = [file]
  })

  fontFiles.forEach(file => {
    const key = file.replace(REG_FONTS, '$1')
    entry[key] = [file]
  })

  movFiles.forEach(file => {
    const key = file.replace(REG_MOV, '$1')
    entry[key] = [file]
  })

  entry['vendor'] = ['babel-polyfill', 'jquery']
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
          use: { loader: 'babel-loader' }
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
        {
          test: /\.(png|jpe?g|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'img/'
              }
            },
            {
              loader: 'image-webpack-loader',
              options: {
                mozjpeg: {
                  progressive: true,
                  quality: 80
                },
                optipng: {
                  enabled: false
                },
                pngquant: {
                  quality: '65-90',
                  speed: 4
                },
                gifsicle: {
                  interlaced: false
                },
                webp: {
                  quality: 80
                }
              }
            }
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|svg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'fonts/'
              }
            }
          ]
        },
        {
          test: /\.(mp4|mov)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'movie/'
              }
            }
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
      new MiniCssExtractPlugin({
        filename: 'css/[name].css'
      })
    ],
    stats: 'none'
  })
}
