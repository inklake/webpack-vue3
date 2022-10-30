const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintWebpackPlugin = require('eslint-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const { loadEnvConfig } = require('./utils')

const PROCESS_CWD = process.cwd()

const envConfig = loadEnvConfig()

module.exports = {
  entry: './src/main.ts',

  output: {
    filename: 'static/js/[name].[contenthash].js',
    path: path.resolve(PROCESS_CWD, 'dist'),
    publicPath: '/',
    clean: true,
  },

  resolve: {
    alias: {
      '@': path.resolve(PROCESS_CWD, 'src'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.json'],
  },

  plugins: [
    new ESLintWebpackPlugin({
      emitError: true,
      emitWarning: true,
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue'],
      formatter: require('eslint-formatter-friendly'),
    }),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(PROCESS_CWD, 'public/index.html'),
      templateParameters: {
        ...envConfig,
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(PROCESS_CWD, 'public'),
          toType: 'dir',
          globOptions: {
            ignore: ['**/index.html'],
          },
          noErrorOnMissing: true,
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash].css',
    }),
  ],

  module: {
    noParse: /^(vue|vue-router|pinia)$/,

    rules: [
      // vue
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },

      // babel
      {
        test: /\.m?jsx?$/,
        exclude: (file) => {
          // always transpile js in vue files
          if (/\.vue\.jsx?$/.test(file)) {
            return false
          }
          // Don't transpile node_modules
          return /node_modules/.test(file)
        },
        use: ['thread-loader', 'babel-loader'],
      },

      // ts
      {
        test: /\.tsx?$/,
        use: [
          'thread-loader',
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              appendTsSuffixTo: ['\\.vue$'],
              happyPackMode: true,
            },
          },
        ],
      },

      // css
      {
        test: /\.(sa|sc|c)ss$/, // 可以打包后缀为sass/scss/css的文件
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },

      // images
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        type: 'asset',
        generator: { filename: 'static/images/[contenthash:8][ext][query]' },
      },

      // svg.
      {
        test: /\.(svg)(\?.*)?$/,
        type: 'asset/resource',
        generator: { filename: 'static/images/[contenthash:8][ext][query]' },
      },
    ],
  },
}
