'use strict'

/* eslint-env node */

const requireEnv = require('@jcoreio/require-env')
const webpack = require('webpack')
const path = require('path')
const ProgressPlugin = require('webpack/lib/ProgressPlugin')
const env = process.env.NODE_ENV
const isProd = env === 'production'

module.exports = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? undefined : 'eval',
  output: {
    path: path.join(__dirname, 'assets'),
    filename: 'app.js',
    publicPath: '/assets/',
  },
  entry: ['./src/client/index', 'webpack-hot-middleware/client'],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    new ProgressPlugin({ profile: false }),
  ],
  module: {
    rules: [
      {
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          babelrc: false,
          cacheDirectory: true,
          plugins: [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-transform-runtime',
          ],
          presets: [
            ['@babel/preset-env', { targets: { browsers: 'last 2 versions' } }],
            '@babel/preset-react',
            '@babel/preset-flow',
          ],
        },
        test: /\.js$/,
      },
    ],
  },
  devServer: {
    port: requireEnv('WEBPACK_PORT'),
    contentBase: `http://localhost:${requireEnv('PORT')}`,
    publicPath: '/assets/',
  },
}
